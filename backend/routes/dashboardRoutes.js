const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/stats", dashboardController.getDashboardStats);
router.get("/sales-chart", dashboardController.getSalesChartData);
router.get("/top-products", dashboardController.getTopProducts);
router.get("/repair-stats", dashboardController.getRepairStats);
router.get("/inventory-summary", dashboardController.getInventorySummary);

module.exports = router;
