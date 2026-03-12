const mysql = require("mysql2");
require("dotenv").config(); // 👈 ADD THIS LINE

// Create connection pool with MAMP port
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "chala",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "chala_mobile",
  port: process.env.DB_PORT || 3366, // Change to 3366 based on your test
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Convert to promise-based for async/await
const promisePool = pool.promise();

// Test connection function
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("✅ MySQL connected successfully");
    console.log("Connected to database:", process.env.DB_NAME);
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
};

testConnection();

module.exports = promisePool;
