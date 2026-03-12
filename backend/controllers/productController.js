const db = require("../config/database");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products ORDER BY created_at DESC",
    );
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

// Get single product
const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

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

// Create new product
const createProduct = async (req, res) => {
  const {
    name,
    category,
    type,
    brand,
    model,
    price,
    stock_quantity,
    description,
    image_url,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO products (name, category, type, brand, model, price, stock_quantity, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        category,
        type,
        brand,
        model,
        price,
        stock_quantity,
        description,
        image_url,
      ],
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { id: result.insertId, ...req.body },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    type,
    brand,
    model,
    price,
    stock_quantity,
    description,
    image_url,
  } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE products SET name=?, category=?, type=?, brand=?, model=?, price=?, stock_quantity=?, description=?, image_url=? WHERE id=?",
      [
        name,
        category,
        type,
        brand,
        model,
        price,
        stock_quantity,
        description,
        image_url,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
