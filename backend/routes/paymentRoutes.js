const express = require("express");
const router = express.Router();
const axios = require("axios"); // You'll need to install axios if not already
const crypto = require("crypto");

// Chapa configuration
const CHAPA_SECRET_KEY =
  process.env.CHAPA_SECRET_KEY ||
  "CHASECK_TEST-JyBVeiRocvJGtofsAa4cgE8Gw8jkoQft";
const CHAPA_API_URL = "https://api.chapa.co/v1";

// Create axios instance for Chapa
const chapaApi = axios.create({
  baseURL: CHAPA_API_URL,
  headers: {
    Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

// Test endpoint
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Payment routes are working",
    chapa_configured: !!CHAPA_SECRET_KEY,
  });
});

// Test payment with direct axios
// ✅ TEST PAYMENT ENDPOINT - With valid email
router.get("/test-payment", async (req, res) => {
  try {
    const tx_ref = `TEST-${Date.now()}`;
    
    const paymentData = {
      amount: "100",
      currency: "ETB",
      email: "customer@gmail.com",  // Use a realistic email
      first_name: "Test",
      last_name: "User",
      phone_number: "0982310974",    // Add phone number (required)
      tx_ref: tx_ref,
      callback_url: "http://localhost:5000/api/payments/verify",
      return_url: "http://localhost:5173/payment-success",
      customization: {
        title: "Test Payment",
        description: "Testing Chapa Integration"
      }
    };

    console.log("🔵 Sending to Chapa:", JSON.stringify(paymentData, null, 2));

    const response = await chapaApi.post('/transaction/initialize', paymentData);
    
    console.log("🟢 Chapa Response:", JSON.stringify(response.data, null, 2));

    res.json({
      success: true,
      message: "Payment initialized successfully",
      checkout_url: response.data.data?.checkout_url,
      data: response.data
    });

  } catch (error) {
    console.error("🔴 Chapa Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    res.status(error.response?.status || 500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message
    });
  }
});

// Initialize payment
// Initialize payment
router.post("/initialize", async (req, res) => {
  try {
    const {
      amount,
      email,
      first_name,
      last_name,
      product_name,
      customer_phone,
      product_id, // Make sure to pass this from frontend
    } = req.body;

    // Validate required fields
    if (!amount || !email || !first_name || !product_name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const tx_ref = `CHALA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

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

    console.log("🔵 Initializing payment:", JSON.stringify(paymentData, null, 2));

    const response = await chapaApi.post('/transaction/initialize', paymentData);

    console.log("🟢 Chapa response:", JSON.stringify(response.data, null, 2));

    if (response.data && response.data.data && response.data.data.checkout_url) {
      
      // ✅ SAVE TO DATABASE
      try {
        // Make sure you have a Transaction model with a saveTransaction method
        await Transaction.saveTransaction({
          tx_ref: tx_ref,
          amount: parseFloat(amount),
          customer_name: `${first_name} ${last_name}`.trim(),
          customer_email: email,
          customer_phone: customer_phone || '',
          product_name: product_name,
          product_id: product_id || null,
          status: 'pending'
        });
        console.log('✅ Transaction saved to database with status: pending');
      } catch (dbError) {
        console.error('❌ Failed to save transaction to database:', dbError);
        // Continue - payment was still initialized
      }

      res.json({
        success: true,
        checkout_url: response.data.data.checkout_url,
        tx_ref: tx_ref,
      });
    } else {
      throw new Error("Invalid response from Chapa");
    }

  } catch (error) {
    console.error("🔴 Payment initialization error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });

    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Payment initialization failed",
      details: error.response?.data || error.message,
    });
  }
});
// Verify payment webhook
router.post("/verify", async (req, res) => {
  const { tx_ref, status } = req.body;

  try {
    console.log("🔵 Verifying payment:", { tx_ref, status });

    // Verify with Chapa
    const response = await chapaApi.get(`/transaction/verify/${tx_ref}`);

    console.log(
      "🟢 Verification response:",
      JSON.stringify(response.data, null, 2),
    );

    if (response.data.status === "success") {
      // Payment successful
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.error(
      "🔴 Verification error:",
      error.response?.data || error.message,
    );
    res.sendStatus(500);
  }
});

// Get transaction status
router.get("/status/:tx_ref", async (req, res) => {
  try {
    const { tx_ref } = req.params;

    const response = await chapaApi.get(`/transaction/verify/${tx_ref}`);

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("🔴 Status error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

module.exports = router;
