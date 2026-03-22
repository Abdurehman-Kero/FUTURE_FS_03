const db = require("../config/database");

// Get all repairs with customer and technician info
const getAllRepairs = async (req, res) => {
  try {
    const [rows] = await db.query(`
            SELECT r.*, 
                   c.name as customer_name, 
                   c.phone as customer_phone,
                   s.name as technician_name
            FROM repairs r
            LEFT JOIN customers c ON r.customer_id = c.id
            LEFT JOIN staff s ON r.technician_id = s.id
            ORDER BY r.created_at DESC
        `);

    // Get parts used for each repair
    for (let repair of rows) {
      const [parts] = await db.query(
        `
                SELECT rp.*, p.name as part_name 
                FROM repair_parts rp
                JOIN products p ON rp.product_id = p.id
                WHERE rp.repair_id = ?
            `,
        [repair.id],
      );
      repair.parts_used = parts;
    }

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

// Get single repair with details
const getRepairById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `
            SELECT r.*, 
                   c.name as customer_name, 
                   c.phone as customer_phone,
                   c.email as customer_email,
                   s.name as technician_name
            FROM repairs r
            LEFT JOIN customers c ON r.customer_id = c.id
            LEFT JOIN staff s ON r.technician_id = s.id
            WHERE r.id = ?
        `,
      [req.params.id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    // Get parts used
    const [parts] = await db.query(
      `
            SELECT rp.*, p.name as part_name, p.category 
            FROM repair_parts rp
            JOIN products p ON rp.product_id = p.id
            WHERE rp.repair_id = ?
        `,
      [req.params.id],
    );

    rows[0].parts_used = parts;

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create new repair
const createRepair = async (req, res) => {
  const {
    customer_id,
    customer_name,
    customer_phone,
    device_type,
    device_brand,
    device_model,
    issue_description,
    estimated_cost,
  } = req.body;

  // Validation
  if (!customer_name || !customer_phone) {
    return res.status(400).json({
      success: false,
      message: "Customer name and phone are required",
    });
  }

  if (!device_type || !issue_description) {
    return res.status(400).json({
      success: false,
      message: "Device type and issue description are required",
    });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    let finalCustomerId = customer_id;

    // If no customer_id, create a new customer
    if (!customer_id) {
      const [existingCustomer] = await connection.query(
        "SELECT id FROM customers WHERE phone = ?",
        [customer_phone],
      );

      if (existingCustomer.length > 0) {
        finalCustomerId = existingCustomer[0].id;
      } else {
        const [customerResult] = await connection.query(
          "INSERT INTO customers (name, phone) VALUES (?, ?)",
          [customer_name, customer_phone],
        );
        finalCustomerId = customerResult.insertId;
      }
    }

    // Create repair
    const [result] = await connection.query(
      `INSERT INTO repairs 
            (customer_id, device_type, device_brand, device_model, issue_description, estimated_cost, status) 
            VALUES (?, ?, ?, ?, ?, ?, 'received')`,
      [
        finalCustomerId,
        device_type,
        device_brand || null,
        device_model || null,
        issue_description,
        estimated_cost || 0,
      ],
    );

    await connection.commit();

    const [newRepair] = await db.query(
      `SELECT r.*, c.name as customer_name, c.phone as customer_phone 
       FROM repairs r
       LEFT JOIN customers c ON r.customer_id = c.id
       WHERE r.id = ?`,
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Repair created successfully",
      data: newRepair[0],
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Create repair error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

// Update repair status
const updateRepairStatus = async (req, res) => {
  const { id } = req.params;
  const { status, final_cost, technician_id } = req.body;

  const validStatuses = [
    "received",
    "diagnosing",
    "in_progress",
    "completed",
    "delivered",
  ];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const updates = [];
    const values = [];

    if (status) {
      updates.push("status = ?");
      values.push(status);
    }
    if (final_cost !== undefined) {
      updates.push("final_cost = ?");
      values.push(final_cost);
    }
    if (technician_id) {
      updates.push("technician_id = ?");
      values.push(technician_id);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updates provided",
      });
    }

    values.push(id);

    await db.query(
      `UPDATE repairs SET ${updates.join(", ")} WHERE id = ?`,
      values,
    );

    const [updated] = await db.query(
      `SELECT r.*, c.name as customer_name, c.phone as customer_phone 
       FROM repairs r
       LEFT JOIN customers c ON r.customer_id = c.id
       WHERE r.id = ?`,
      [id],
    );

    res.json({
      success: true,
      message: "Repair updated successfully",
      data: updated[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add part to repair
const addRepairPart = async (req, res) => {
  const { id } = req.params;
  const { product_id, quantity, price_at_time } = req.body;

  if (!product_id || !quantity || !price_at_time) {
    return res.status(400).json({
      success: false,
      message: "Product ID, quantity, and price are required",
    });
  }

  try {
    // Check if repair exists
    const [repair] = await db.query("SELECT id FROM repairs WHERE id = ?", [
      id,
    ]);
    if (repair.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Repair not found",
      });
    }

    // Check if product exists and has stock
    const [product] = await db.query(
      "SELECT stock_quantity FROM products WHERE id = ?",
      [product_id],
    );
    if (product.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product[0].stock_quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    // Add part to repair
    const [result] = await db.query(
      "INSERT INTO repair_parts (repair_id, product_id, quantity, price_at_time) VALUES (?, ?, ?, ?)",
      [id, product_id, quantity, price_at_time],
    );

    // Update product stock
    await db.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?",
      [quantity, product_id],
    );

    // Update repair final cost
    await db.query(
      "UPDATE repairs SET final_cost = final_cost + ? WHERE id = ?",
      [price_at_time * quantity, id],
    );

    const [newPart] = await db.query(
      `
            SELECT rp.*, p.name as part_name 
            FROM repair_parts rp
            JOIN products p ON rp.product_id = p.id
            WHERE rp.id = ?
        `,
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Part added to repair successfully",
      data: newPart[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get repairs by status
const getRepairsByStatus = async (req, res) => {
  const { status } = req.params;

  const validStatuses = [
    "received",
    "diagnosing",
    "in_progress",
    "completed",
    "delivered",
  ];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status value",
    });
  }

  try {
    const [rows] = await db.query(
      `
            SELECT r.*, 
                   c.name as customer_name, 
                   c.phone as customer_phone,
                   s.name as technician_name
            FROM repairs r
            LEFT JOIN customers c ON r.customer_id = c.id
            LEFT JOIN staff s ON r.technician_id = s.id
            WHERE r.status = ?
            ORDER BY r.created_at DESC
        `,
      [status],
    );

    res.json({
      success: true,
      count: rows.length,
      status: status,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ DELETE repair - ADD THIS FUNCTION
const deleteRepair = async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Check if repair exists
    const [repairs] = await connection.query(
      "SELECT * FROM repairs WHERE id = ?",
      [id],
    );

    if (repairs.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    // Check if there are any parts used in this repair
    const [parts] = await connection.query(
      "SELECT * FROM repair_parts WHERE repair_id = ?",
      [id],
    );

    // If there are parts, restore stock
    for (const part of parts) {
      await connection.query(
        "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
        [part.quantity, part.product_id],
      );

      // Delete the part record
      await connection.query("DELETE FROM repair_parts WHERE id = ?", [
        part.id,
      ]);
    }

    // Delete the repair
    const [result] = await connection.query(
      "DELETE FROM repairs WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: "Repair ticket not found",
      });
    }

    await connection.commit();

    res.json({
      success: true,
      message:
        "Repair ticket deleted successfully" +
        (parts.length > 0 ? " and stock restored" : ""),
    });
  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Error deleting repair:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete repair ticket",
      error: error.message,
    });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = {
  getAllRepairs,
  getRepairById,
  createRepair,
  updateRepairStatus,
  addRepairPart,
  getRepairsByStatus,
  deleteRepair, // ✅ ADDED
};
