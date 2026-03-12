const express = require("express");
const cors = require("cors");
require("dotenv").config();
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
app.get("/", (req, res) => {
  res.json({ message: "Chala Mobile API is running!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
