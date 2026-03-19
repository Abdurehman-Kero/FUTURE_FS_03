const db = require('../config/database');

// Get all sales with product and customer details
const getAllSales = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, 
                   p.name as product_name, 
                   p.category as product_category,
                   c.name as customer_name,
                   c.phone as customer_phone
            FROM sales s
            LEFT JOIN products p ON s.product_id = p.id
            LEFT JOIN customers c ON s.customer_id = c.id
            ORDER BY s.created_at DESC
        `);
        
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get single sale by ID
const getSaleById = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, 
                   p.name as product_name,
                   p.brand as product_brand,
                   p.category as product_category,
                   c.name as customer_name,
                   c.phone as customer_phone,
                   c.email as customer_email
            FROM sales s
            LEFT JOIN products p ON s.product_id = p.id
            LEFT JOIN customers c ON s.customer_id = c.id
            WHERE s.id = ?
        `, [req.params.id]);
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sale not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create new sale
const createSale = async (req, res) => {
    const { product_id, customer_id, quantity, payment_method } = req.body;
    
    // Validation
    if (!product_id || !quantity) {
        return res.status(400).json({
            success: false,
            message: 'Product ID and quantity are required'
        });
    }

    try {
        // Get product details
        const [productRows] = await db.query(
            'SELECT * FROM products WHERE id = ?', 
            [product_id]
        );
        
        if (productRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        const product = productRows[0];
        
        // Check stock
        if (product.stock_quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${product.stock_quantity}`
            });
        }

        // Calculate total
        const unit_price = product.price;
        const total_amount = unit_price * quantity;

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            // Create sale
            const [saleResult] = await connection.query(
                `INSERT INTO sales 
                (product_id, customer_id, quantity, unit_price, total_amount, payment_method) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [product_id, customer_id || null, quantity, unit_price, total_amount, payment_method || 'cash']
            );

            // Update product stock
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [quantity, product_id]
            );

            await connection.commit();

            // Get the created sale
            const [newSale] = await db.query(`
                SELECT s.*, p.name as product_name 
                FROM sales s
                JOIN products p ON s.product_id = p.id
                WHERE s.id = ?
            `, [saleResult.insertId]);

            res.status(201).json({
                success: true,
                message: 'Sale completed successfully',
                data: newSale[0],
                receipt: {
                    sale_id: saleResult.insertId,
                    product: product.name,
                    quantity: quantity,
                    unit_price: unit_price,
                    total: total_amount,
                    payment_method: payment_method || 'cash',
                    date: new Date()
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get sales by date range
const getSalesByDateRange = async (req, res) => {
    const { start_date, end_date } = req.query;
    
    if (!start_date || !end_date) {
        return res.status(400).json({
            success: false,
            message: 'Start date and end date are required (YYYY-MM-DD)'
        });
    }

    try {
        const [rows] = await db.query(`
            SELECT s.*, 
                   p.name as product_name,
                   c.name as customer_name
            FROM sales s
            LEFT JOIN products p ON s.product_id = p.id
            LEFT JOIN customers c ON s.customer_id = c.id
            WHERE DATE(s.created_at) BETWEEN ? AND ?
            ORDER BY s.created_at DESC
        `, [start_date, end_date]);

        // Calculate totals
        const total_sales = rows.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
        const total_transactions = rows.length;

        res.json({
            success: true,
            date_range: {
                start: start_date,
                end: end_date
            },
            summary: {
                total_sales: total_sales,
                total_transactions: total_transactions,
                average_sale: total_transactions > 0 ? total_sales / total_transactions : 0
            },
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get today's sales
const getTodaysSales = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT s.*, 
                   p.name as product_name
            FROM sales s
            JOIN products p ON s.product_id = p.id
            WHERE DATE(s.created_at) = CURDATE()
            ORDER BY s.created_at DESC
        `);

        const total = rows.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);

        res.json({
            success: true,
            date: new Date().toISOString().split('T')[0],
            summary: {
                total_sales: total,
                transaction_count: rows.length
            },
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get sales by payment method
const getSalesByPaymentMethod = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                payment_method,
                COUNT(*) as transaction_count,
                SUM(total_amount) as total_amount
            FROM sales
            GROUP BY payment_method
        `);

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Create sale from successful transaction
const createSaleFromTransaction = async (transaction) => {
  try {
    // Check if sale already exists for this transaction
    const [existing] = await db.query(
      'SELECT id FROM sales WHERE tx_ref = ?',
      [transaction.tx_ref]
    );

    if (existing.length > 0) {
      return existing[0].id;
    }

    // Create new sale
    const [result] = await db.query(
      `INSERT INTO sales 
       (product_id, customer_name, customer_phone, customer_email, quantity, 
        unit_price, total_amount, payment_method, payment_status, tx_ref, warranty_months) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        transaction.product_id,
        transaction.customer_name,
        transaction.customer_phone || null,
        transaction.customer_email,
        1, // quantity
        transaction.amount,
        transaction.amount,
        'chapa',
        'paid',
        transaction.tx_ref,
        12 // default warranty
      ]
    );

    // Update product stock
    if (transaction.product_id) {
      await db.query(
        'UPDATE products SET stock_quantity = stock_quantity - 1 WHERE id = ?',
        [transaction.product_id]
      );
    }

    return result.insertId;
  } catch (error) {
    console.error('Error creating sale from transaction:', error);
    throw error;
  }
};


module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  getSalesByDateRange,
  getTodaysSales,
  getSalesByPaymentMethod,
  createSaleFromTransaction,
};