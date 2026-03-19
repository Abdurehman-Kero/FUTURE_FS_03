const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
// Add to your imports
const paymentRoutes = require('./routes/paymentRoutes');

// Add before protected routes (public)
// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const customerRoutes = require("./routes/customerRoutes");
const repairRoutes = require("./routes/repairRoutes");
const saleRoutes = require("./routes/saleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const uploadRoutes = require("./routes/uploadRoutes"); // 👈 Add this

// Import middleware
const { verifyToken } = require("./middleware/auth");

const app = express();

const paymentRoutes = require("./routes/paymentRoutes");
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use('/api/payments', paymentRoutes);
// Public routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes); // 👈 Add this - public upload endpoint

// Protected routes (require authentication)
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
});
