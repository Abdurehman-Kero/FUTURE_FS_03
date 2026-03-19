const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

// ✅ IMPORT YOUR TRANSACTION MODEL
const Transaction = require("../models/Transaction");

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

// Test payment endpoint
router.get("/test-payment", async (req, res) => {
  try {
    const tx_ref = `TEST-${Date.now()}`;

    const paymentData = {
      amount: "100",
      currency: "ETB",
      email: "customer@gmail.com",
      first_name: "Test",
      last_name: "User",
      phone_number: "0982310974",
      tx_ref: tx_ref,
      callback_url: "http://localhost:5000/api/payments/verify",
      return_url: "http://localhost:5173/payment-success",
      customization: {
        title: "Test Payment",
        description: "Testing Chapa Integration",
      },
    };

    console.log("🔵 Sending to Chapa:", JSON.stringify(paymentData, null, 2));

    const response = await chapaApi.post(
      "/transaction/initialize",
      paymentData,
    );

    console.log("🟢 Chapa Response:", JSON.stringify(response.data, null, 2));

    res.json({
      success: true,
      message: "Payment initialized successfully",
      checkout_url: response.data.data?.checkout_url,
      data: response.data,
    });
  } catch (error) {
    console.error("🔴 Chapa Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    res.status(error.response?.status || 500).json({
      success: false,
      message: "Payment initialization failed",
      error: error.response?.data || error.message,
    });
  }
});

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
      product_id,
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

    console.log(
      "🔵 Initializing payment:",
      JSON.stringify(paymentData, null, 2),
    );

    const response = await chapaApi.post(
      "/transaction/initialize",
      paymentData,
    );

    console.log("🟢 Chapa response:", JSON.stringify(response.data, null, 2));

    if (
      response.data &&
      response.data.data &&
      response.data.data.checkout_url
    ) {
      // ✅ SAVE TO DATABASE - NOW Transaction IS DEFINED
      try {
        const savedId = await Transaction.saveTransaction({
          tx_ref: tx_ref,
          amount: parseFloat(amount),
          customer_name: `${first_name} ${last_name}`.trim(),
          customer_email: email,
          customer_phone: customer_phone || "",
          product_name: product_name,
          product_id: product_id || null,
          status: "pending",
        });
        console.log(`✅ Transaction saved to database with ID: ${savedId}`);
      } catch (dbError) {
        console.error("❌ Failed to save transaction to database:", dbError);
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
      status: error.response?.status,
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
      // ✅ UPDATE TRANSACTION STATUS
      try {
        await Transaction.updateTransactionStatus(tx_ref, "completed");
        console.log(`✅ Transaction ${tx_ref} marked as completed`);
      } catch (dbError) {
        console.error("❌ Failed to update transaction:", dbError);
      }

      res.sendStatus(200);
    } else {
      // Update as failed
      await Transaction.updateTransactionStatus(tx_ref, "failed");
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

    // First check your database
    const transaction = await Transaction.getTransactionByRef(tx_ref);

    if (transaction) {
      res.json({
        success: true,
        data: transaction,
      });
    } else {
      // Fallback to Chapa
      const response = await chapaApi.get(`/transaction/verify/${tx_ref}`);
      res.json({
        success: true,
        data: response.data,
      });
    }
  } catch (error) {
    console.error("🔴 Status error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

module.exports = router;
