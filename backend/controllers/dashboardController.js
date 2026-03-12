const db = require("../config/database");

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get today's sales
    const [todaySales] = await db.query(`
            SELECT 
                COALESCE(SUM(total_amount), 0) as total,
                COUNT(*) as count
            FROM sales 
            WHERE DATE(created_at) = CURDATE()
        `);

    // Get monthly sales
    const [monthlySales] = await db.query(`
            SELECT 
                COALESCE(SUM(total_amount), 0) as total,
                COUNT(*) as count
            FROM sales 
            WHERE MONTH(created_at) = MONTH(CURDATE()) 
            AND YEAR(created_at) = YEAR(CURDATE())
        `);

    // Get active repairs
    const [activeRepairs] = await db.query(`
            SELECT COUNT(*) as count
            FROM repairs 
            WHERE status IN ('received', 'diagnosing', 'in_progress')
        `);

    // Get completed repairs today
    const [completedToday] = await db.query(`
            SELECT COUNT(*) as count
            FROM repairs 
            WHERE status = 'completed' 
            AND DATE(updated_at) = CURDATE()
        `);

    // Get low stock products (less than 5 items)
    const [lowStock] = await db.query(`
            SELECT COUNT(*) as count
            FROM products 
            WHERE stock_quantity < 5 AND stock_quantity > 0
        `);

    // Get out of stock products
    const [outOfStock] = await db.query(`
            SELECT COUNT(*) as count
            FROM products 
            WHERE stock_quantity = 0
        `);

    // Get total customers
    const [totalCustomers] = await db.query(`
            SELECT COUNT(*) as count FROM customers
        `);

    res.json({
      success: true,
      data: {
        sales: {
          today: {
            total: todaySales[0].total,
            transactions: todaySales[0].count,
          },
          this_month: {
            total: monthlySales[0].total,
            transactions: monthlySales[0].count,
          },
        },
        repairs: {
          active: activeRepairs[0].count,
          completed_today: completedToday[0].count,
        },
        inventory: {
          low_stock: lowStock[0].count,
          out_of_stock: outOfStock[0].count,
        },
        customers: {
          total: totalCustomers[0].count,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get sales chart data (last 7 days)
const getSalesChartData = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as transaction_count,
                SUM(total_amount) as total_sales
            FROM sales
            WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date DESC
        `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get top selling products
const getTopProducts = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT 
                p.id,
                p.name,
                p.brand,
                p.category,
                COUNT(s.id) as times_sold,
                SUM(s.quantity) as total_quantity,
                SUM(s.total_amount) as total_revenue
            FROM products p
            JOIN sales s ON p.id = s.product_id
            WHERE s.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP BY p.id
            ORDER BY total_quantity DESC
            LIMIT 10
        `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get repair status breakdown
const getRepairStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM repairs
            GROUP BY status
        `);

    const [commonIssues] = await db.query(`
            SELECT 
                issue_description,
                COUNT(*) as frequency
            FROM repairs
            GROUP BY issue_description
            ORDER BY frequency DESC
            LIMIT 5
        `);

    res.json({
      success: true,
      data: {
        by_status: rows,
        common_issues: commonIssues,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get inventory summary
const getInventorySummary = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT 
                category,
                COUNT(*) as total_products,
                SUM(stock_quantity) as total_stock,
                SUM(CASE WHEN stock_quantity = 0 THEN 1 ELSE 0 END) as out_of_stock,
                SUM(CASE WHEN stock_quantity < 5 AND stock_quantity > 0 THEN 1 ELSE 0 END) as low_stock
            FROM products
            GROUP BY category
        `);

    const [totalValue] = await db.query(`
            SELECT 
                SUM(price * stock_quantity) as total_inventory_value
            FROM products
        `);

    res.json({
      success: true,
      data: {
        by_category: rows,
        total_value: totalValue[0].total_inventory_value || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getSalesChartData,
  getTopProducts,
  getRepairStats,
  getInventorySummary,
};
