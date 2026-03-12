const mysql = require("mysql2");

// Create connection pool with MAMP port
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 8889, // MAMP default port
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
    console.log("✅ MySQL connected successfully (MAMP)");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:", error.message);
  }
};

testConnection();

module.exports = promisePool;
