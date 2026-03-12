const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Public routes
router.post("/login", authController.login);

// Protected routes
router.get("/profile", verifyToken, authController.getProfile);
router.post("/change-password", verifyToken, authController.changePassword);

// Admin only routes
router.post("/register", verifyToken, isAdmin, authController.register);
router.get("/staff", verifyToken, isAdmin, authController.getAllStaff);
router.put(
  "/staff/:id/role",
  verifyToken,
  isAdmin,
  authController.updateStaffRole,
);

module.exports = router;
