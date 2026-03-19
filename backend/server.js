const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const repairRoutes = require("./routes/repairRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // 👈 MOVED WITH OTHER IMPORTS

// Import middleware
const { verifyToken } = require("./middleware/auth");

const app = express();

// Middleware (these should come first)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ PUBLIC ROUTES - ALL PUBLIC ROUTES TOGETHER
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes); // 👈 MOVED HERE WITH OTHER PUBLIC ROUTES

// ✅ PROTECTED ROUTES - ALL PROTECTED ROUTES TOGETHER
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
      products: "/api/products (public)",
      upload: "/api/upload/product-image (public)",
      payments: "/api/payments (public)", // 👈 ADDED
      customers: "/api/customers (protected)",
      repairs: "/api/repairs (protected)",
      sales: "/api/sales (protected)",
      dashboard: "/api/dashboard (protected)",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Chala Mobile API running on port ${PORT}`);
  console.log(`📝 Test: http://localhost:${PORT}/api/test`);
  console.log(`📦 Products: http://localhost:${PORT}/api/products (PUBLIC)`);
  console.log(`📤 Upload: http://localhost:${PORT}/api/upload/product-image`);
  console.log(`💳 Payments: http://localhost:${PORT}/api/payments (PUBLIC)`); // 👈 ADDED
});
