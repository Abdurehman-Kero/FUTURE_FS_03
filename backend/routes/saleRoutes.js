const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");

// Specific routes first
router.get("/today", saleController.getTodaysSales);
router.get("/by-date", saleController.getSalesByDateRange);
router.get("/by-payment", saleController.getSalesByPaymentMethod);

// Generic routes
router.get("/", saleController.getAllSales);
router.get("/:id", saleController.getSaleById);
router.post("/", saleController.createSale);

module.exports = router;
