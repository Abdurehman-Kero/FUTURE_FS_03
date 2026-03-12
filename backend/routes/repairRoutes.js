const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repairController");

// Status-based route (should come before /:id)
router.get("/status/:status", repairController.getRepairsByStatus);

// Repair routes
router.get("/", repairController.getAllRepairs);
router.get("/:id", repairController.getRepairById);
router.post("/", repairController.createRepair);
router.patch("/:id/status", repairController.updateRepairStatus);
router.post("/:id/parts", repairController.addRepairPart);

module.exports = router;
