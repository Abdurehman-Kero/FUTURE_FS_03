const express = require("express");
const router = express.Router();
const { Chapa } = require("chapa-nodejs");

// Initialize Chapa with your test key
const chapa = new Chapa({
  secretKey:
    process.env.CHAPA_SECRET_KEY ||
    "CHASECK_TEST-JyBVeiRocvJGtofsAa4cgE8Gw8jkoQft",
});

// Test endpoint to verify Chapa is working
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are working",
    chapa_initialized: !!chapa,
  });
});

// Simple test payment
router.get("/test-payment", async (req, res) => {
  try {
    const testData = {
      amount: "100",
      currency: "ETB",
      email: "test@example.com",
      first_name: "Test",
      last_name: "User",
      tx_ref: `TEST-${Date.now()}`,
      callback_url: "http://localhost:5000/api/payments/verify",
      return_url: "http://localhost:5173/payment-success",
      customization: {
        title: "Test Payment",
        description: "Testing Chapa Integration",
      },
    };

    console.log("Testing Chapa with:", testData);

    const response = await chapa.initialize(testData);

    res.json({
      success: true,
      message: "Chapa test successful",
      checkout_url: response.data?.checkout_url,
    });
  } catch (error) {
    console.error("Chapa test failed:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.response?.data || error,
    });
  }
});

// Initialize payment - CORRECTED VERSION
router.post("/initialize", async (req, res) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      product_name,
      customer_phone,
    } = req.body;

    // Validate required fields
    if (!amount || !email || !first_name || !product_name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Generate unique transaction reference
    const tx_ref = `CHALA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Prepare payment data - EXACT format Chapa expects
    const paymentData = {
      amount: amount.toString(),
      currency: "ETB",
      email: email,
      first_name: first_name,
      last_name: last_name || "",
      phone_number: customer_phone || "",
      tx_ref: tx_ref,
      callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/payments/verify`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success`,
      customization: {
        title: "Chala Mobile",
        description: `Payment for ${product_name}`,
      },
    };

    console.log("Sending to Chapa:", JSON.stringify(paymentData, null, 2));

    // Initialize with Chapa
    const response = await chapa.initialize(paymentData);

    console.log("Chapa response:", JSON.stringify(response, null, 2));

    if (response && response.data && response.data.checkout_url) {
      res.json({
        success: true,
        checkout_url: response.data.checkout_url,
        tx_ref: tx_ref,
      });
    } else {
      throw new Error(response?.message || "Payment initialization failed");
    }
  } catch (error) {
    console.error("Payment initialization error:", error);

    // Detailed error response
    res.status(500).json({
      success: false,
      message: error.message || "Payment initialization failed",
      details: error.response?.data || error,
    });
  }
});

// Verify payment webhook
router.post("/verify", async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    console.log("Verifying payment:", { tx_ref, status });

    // Verify with Chapa
    const verifyResponse = await chapa.verify(tx_ref);

    console.log("Verify response:", verifyResponse);

    if (
      verifyResponse.status === "success" &&
      verifyResponse.data?.status === "success"
    ) {
      // Payment successful
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.sendStatus(500);
  }
});

// Get transaction status
router.get("/status/:tx_ref", async (req, res) => {
  try {
    const { tx_ref } = req.params;

    // You can verify with Chapa or check your database
    const verifyResponse = await chapa.verify(tx_ref);

    res.json({
      success: true,
      data: verifyResponse.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
