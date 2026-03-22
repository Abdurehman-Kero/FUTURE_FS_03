const express = require("express");
const router = express.Router();
const repairController = require("../controllers/repairController");

// Specific routes first
router.get("/status/:status", repairController.getRepairsByStatus);

// ✅ DELETE route - Add this
router.delete("/:id", repairController.deleteRepair);

// Generic routes
router.get("/", repairController.getAllRepairs);
router.get("/:id", repairController.getRepairById);
router.post("/", repairController.createRepair);
router.patch("/:id/status", repairController.updateRepairStatus);
router.post("/:id/parts", repairController.addRepairPart);

module.exports = router;
