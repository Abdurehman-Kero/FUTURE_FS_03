const mysql = require("mysql2");
require("dotenv").config();

console.log("Testing MySQL connection with:");
console.log("Host:", process.env.DB_HOST);
console.log("Port:", process.env.DB_PORT || 8889);
console.log("User:", process.env.DB_USER);
console.log("Database:", process.env.DB_NAME);

// Try to connect
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 8889,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Connection failed:", err.message);
    console.log("\n🔍 Troubleshooting:");
    console.log("1. Is MAMP running?");
    console.log("2. Is MySQL started in MAMP?");
    console.log("3. Check if port is 8889 (MAMP default)");
    console.log("4. Verify username/password in .env");
  } else {
    console.log("✅ Connected successfully!");
    console.log("MySQL is running!");

    // Test a simple query
    connection.query("SELECT NOW() as time", (err, results) => {
      if (err) {
        console.error("Query failed:", err.message);
      } else {
        console.log("Server time:", results[0].time);
      }
      connection.end();
    });
  }
});
