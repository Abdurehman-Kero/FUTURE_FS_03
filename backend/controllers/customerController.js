const db = require("../config/database");

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM customers ORDER BY created_at DESC",
    );
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single customer with their repair history
const getCustomerById = async (req, res) => {
  try {
    // Get customer details
    const [customerRows] = await db.query(
      "SELECT * FROM customers WHERE id = ?",
      [req.params.id],
    );

    if (customerRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Get their repair history
    const [repairRows] = await db.query(
      `
            SELECT r.*, 
                   s.name as technician_name 
            FROM repairs r 
            LEFT JOIN staff s ON r.technician_id = s.id 
            WHERE r.customer_id = ? 
            ORDER BY r.created_at DESC
        `,
      [req.params.id],
    );

    // Get their purchase history
    const [salesRows] = await db.query(
      `
            SELECT s.*, p.name as product_name 
            FROM sales s 
            JOIN products p ON s.product_id = p.id 
            WHERE s.customer_id = ? 
            ORDER BY s.created_at DESC
        `,
      [req.params.id],
    );

    res.json({
      success: true,
      data: {
        ...customerRows[0],
        repairs: repairRows,
        purchases: salesRows,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new customer
const createCustomer = async (req, res) => {
  const { name, phone, email, address } = req.body;

  // Validation
  if (!name || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name and phone are required",
    });
  }

  try {
    // Check if phone already exists
    const [existing] = await db.query(
      "SELECT id FROM customers WHERE phone = ?",
      [phone],
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Customer with this phone number already exists",
      });
    }

    const [result] = await db.query(
      "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
      [name, phone, email || null, address || null],
    );

    // Get the newly created customer
    const [newCustomer] = await db.query(
      "SELECT * FROM customers WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: newCustomer[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update customer
const updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, phone, email, address } = req.body;

  try {
    // Check if customer exists
    const [existing] = await db.query("SELECT id FROM customers WHERE id = ?", [
      id,
    ]);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Check if phone is taken by another customer
    if (phone) {
      const [phoneCheck] = await db.query(
        "SELECT id FROM customers WHERE phone = ? AND id != ?",
        [phone, id],
      );
      if (phoneCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Phone number already in use by another customer",
        });
      }
    }

    await db.query(
      "UPDATE customers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?",
      [name, phone, email, address, id],
    );

    // Get updated customer
    const [updated] = await db.query("SELECT * FROM customers WHERE id = ?", [
      id,
    ]);

    res.json({
      success: true,
      message: "Customer updated successfully",
      data: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete customer
const deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if customer has repairs or sales
    const [repairs] = await db.query(
      "SELECT id FROM repairs WHERE customer_id = ?",
      [id],
    );
    const [sales] = await db.query(
      "SELECT id FROM sales WHERE customer_id = ?",
      [id],
    );

    if (repairs.length > 0 || sales.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete customer with existing repairs or sales",
      });
    }

    const [result] = await db.query("DELETE FROM customers WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search customers by name or phone
const searchCustomers = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name",
      [`%${q}%`, `%${q}%`],
    );

    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
};
