const db = require("../config/database");

// Get all products
const getAllProducts = async () => {
  const [rows] = await db.query(`
    SELECT p.*, 
           c.name as category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `);
  return rows;
};

// Get product by slug
const getProductBySlug = async (slug) => {
  const [rows] = await db.query(
    `SELECT p.*, 
            c.name as category_name
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ?`,
    [slug],
  );
  return rows[0];
};

// Get product by ID
const getProductById = async (id) => {
  const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
  return rows[0];
};

// Create product with JSON data
const createProduct = async (productData) => {
  const {
    name,
    slug,
    sku,
    category,
    type,
    brand,
    model,
    price,
    stock_quantity,
    description,
    short_description,
    specifications,
    features,
    image_url,
    images,
    warranty_months,
    weight,
    dimensions,
  } = productData;

  const [result] = await db.query(
    `INSERT INTO products 
     (name, slug, sku, category, type, brand, model, price, stock_quantity, 
      description, short_description, specifications, features, image_url, images, 
      warranty_months, weight, dimensions) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      slug,
      sku,
      category,
      type,
      brand,
      model,
      price,
      stock_quantity,
      description,
      short_description || null,
      JSON.stringify(specifications || {}),
      JSON.stringify(features || []),
      image_url || null,
      JSON.stringify(images || []),
      warranty_months || 12,
      weight || null,
      JSON.stringify(dimensions || {}),
    ],
  );
  return result.insertId;
};

// Update product
const updateProduct = async (id, productData) => {
  const {
    name,
    slug,
    sku,
    category,
    type,
    brand,
    model,
    price,
    stock_quantity,
    description,
    short_description,
    specifications,
    features,
    image_url,
    images,
    warranty_months,
    weight,
    dimensions,
  } = productData;

  const [result] = await db.query(
    `UPDATE products SET 
     name = ?, slug = ?, sku = ?, category = ?, type = ?, brand = ?, model = ?, 
     price = ?, stock_quantity = ?, description = ?, short_description = ?, 
     specifications = ?, features = ?, image_url = ?, images = ?, 
     warranty_months = ?, weight = ?, dimensions = ?
     WHERE id = ?`,
    [
      name,
      slug,
      sku,
      category,
      type,
      brand,
      model,
      price,
      stock_quantity,
      description,
      short_description || null,
      JSON.stringify(specifications || {}),
      JSON.stringify(features || []),
      image_url || null,
      JSON.stringify(images || []),
      warranty_months || 12,
      weight || null,
      JSON.stringify(dimensions || {}),
      id,
    ],
  );
  return result.affectedRows;
};

// Delete product
const deleteProduct = async (id) => {
  const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows;
};

// Update product rating
const updateProductRating = async (productId, rating) => {
  const [result] = await db.query(
    "UPDATE products SET rating = ?, reviews_count = reviews_count + 1 WHERE id = ?",
    [rating, productId],
  );
  return result;
};

module.exports = {
  getAllProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductRating,
};
