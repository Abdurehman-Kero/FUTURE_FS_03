const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const repairRoutes = require("./routes/repairRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/repairs", repairRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Chala Mobile API is running!",
    endpoints: {
      products: "/api/products",
      customers: "/api/customers",
      repairs: "/api/repairs",
    },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Chala Mobile API running on port ${PORT}`);
  console.log(`📝 Test: http://localhost:${PORT}/api/test`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products`);
  console.log(`👥 Customers: http://localhost:${PORT}/api/customers`);
  console.log(`🔧 Repairs: http://localhost:${PORT}/api/repairs`);
});
