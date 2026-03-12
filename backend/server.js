const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const repairRoutes = require("./routes/repairRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Import middleware
const { verifyToken } = require("./middleware/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (require authentication)
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/customers", verifyToken, customerRoutes);
app.use("/api/repairs", verifyToken, repairRoutes);
app.use("/api/sales", verifyToken, saleRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);

// Test route (public)
app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Chala Mobile API is running!",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products (protected)",
      customers: "/api/customers (protected)",
      repairs: "/api/repairs (protected)",
      sales: "/api/sales (protected)",
      dashboard: "/api/dashboard (protected)",
    },
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Chala Mobile API running on port ${PORT}`);
  console.log(`📝 Test: http://localhost:${PORT}/api/test`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
});
