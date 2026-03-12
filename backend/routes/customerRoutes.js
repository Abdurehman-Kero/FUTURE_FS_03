const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// Search route (should come before /:id to avoid conflicts)
router.get("/search", customerController.searchCustomers);

// Customer routes
router.get("/", customerController.getAllCustomers);
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
