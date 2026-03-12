const db = require("../config/database");

const createProductTable = async () => {
  try {
    await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                category ENUM('phone', 'laptop', 'tablet', 'accessory') DEFAULT 'phone',
                type ENUM('new', 'used') DEFAULT 'new',
                brand VARCHAR(100),
                model VARCHAR(100),
                price DECIMAL(10,2) NOT NULL,
                stock_quantity INT DEFAULT 0,
                description TEXT,
                image_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
    console.log("✅ Products table ready");
  } catch (error) {
    console.error("Error creating products table:", error);
  }
};

// Run this when server starts
createProductTable();

module.exports = {
  // We'll add CRUD operations here
};
