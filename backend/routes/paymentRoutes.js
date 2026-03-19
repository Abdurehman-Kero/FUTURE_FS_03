const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

// IMPORT YOUR MODELS AND SERVICES
const Transaction = require("../models/Transaction");
const {
  sendReceiptEmail,
  sendAdminNotification,
} = require("../services/emailService");

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
    "ngrok-skip-browser-warning": "true",
  },
});

// ==================== TEST ENDPOINTS ====================

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
      callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/payments/verify`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success`,
      customization: {
        title: "Test Payment",
        description: "Testing Chapa Integration",
      },
    };

    console.log(
      "🔵 Test payment - Sending to Chapa:",
      JSON.stringify(paymentData, null, 2),
    );
    const response = await chapaApi.post(
      "/transaction/initialize",
      paymentData,
    );
    console.log(
      "🟢 Test payment - Chapa Response:",
      JSON.stringify(response.data, null, 2),
    );

    res.json({
      success: true,
      message: "Payment initialized successfully",
      checkout_url: response.data.data?.checkout_url,
      data: response.data,
    });
  } catch (error) {
    console.error("🔴 Test payment - Chapa Error:", {
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

// ==================== INITIALIZE PAYMENT ====================

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
      warranty_months = 12,
    } = req.body;

    // Validate required fields
    if (!amount || !email || !first_name || !product_name) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const tx_ref = `CHALA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // In the paymentData object, update the return_url to include tx_ref
    const paymentData = {
      amount: amount.toString(),
      currency: "ETB",
      email: email,
      first_name: first_name,
      last_name: last_name || "",
      phone_number: customer_phone || "",
      tx_ref: tx_ref,
      callback_url: `${process.env.BASE_URL || "http://localhost:5000"}/api/payments/verify`,
      return_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/payment-success?tx_ref=${tx_ref}`, // 👈 ADD THIS
      customization: {
        title: "Chala Mobile",
        description: `Payment for ${product_name}`,
      },
      meta: {
        warranty_months: warranty_months.toString(),
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
      // SAVE TO DATABASE
      try {
        const savedId = await Transaction.saveTransaction({
          tx_ref: tx_ref,
          amount: parseFloat(amount),
          customer_name: `${first_name} ${last_name}`.trim(),
          customer_email: email,
          customer_phone: customer_phone || "",
          product_name: product_name,
          product_id: product_id || null,
          warranty_months: parseInt(warranty_months),
          status: "pending",
        });
        console.log(`✅ Transaction saved to database with ID: ${savedId}`);
      } catch (dbError) {
        console.error("❌ Failed to save transaction to database:", dbError);
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

// ==================== VERIFY PAYMENT WEBHOOK ====================

router.post("/verify", async (req, res) => {
  // 🚨 ULTRA DETAILED DEBUGGING
  console.log("\n" + "=".repeat(60));
  console.log("🔥🔥🔥 WEBHOOK RECEIVED 🔥🔥🔥");
  console.log("=".repeat(60));
  console.log("📅 Time:", new Date().toISOString());
  console.log("📨 Headers:", JSON.stringify(req.headers, null, 2));
  console.log("📦 Body:", JSON.stringify(req.body, null, 2));
  console.log("🔗 URL:", req.url);
  console.log("🔄 Method:", req.method);
  console.log("=".repeat(60) + "\n");

  const { tx_ref, status } = req.body;

  // Validate input
  if (!tx_ref) {
    console.error("❌ No tx_ref provided in webhook");
    return res.status(400).send("Missing tx_ref");
  }

  try {
    console.log(`🔵 Verifying payment with Chapa for tx_ref: ${tx_ref}`);

    // Verify with Chapa
    const response = await chapaApi.get(`/transaction/verify/${tx_ref}`);
    console.log(
      "🟢 Chapa verification response:",
      JSON.stringify(response.data, null, 2),
    );

    if (response.data.status === "success") {
      console.log("✅ Payment verified as successful by Chapa");

      // UPDATE TRANSACTION STATUS IN DATABASE
      try {
        await Transaction.updateTransactionStatus(tx_ref, "completed");
        console.log(`✅ Transaction ${tx_ref} marked as completed in database`);
      } catch (dbError) {
        console.error("❌ Failed to update transaction status:", dbError);
      }

      // GET FULL TRANSACTION DETAILS
      let transaction;
      try {
        transaction = await Transaction.getTransactionByRef(tx_ref);
        console.log(
          "📦 Transaction from database:",
          JSON.stringify(transaction, null, 2),
        );
      } catch (dbError) {
        console.error("❌ Failed to fetch transaction from database:", dbError);
      }

      if (transaction) {
        // SEND RECEIPT EMAIL TO CUSTOMER
        console.log(
          `📧 Attempting to send receipt email to: ${transaction.customer_email}`,
        );
        try {
          const emailResult = await sendReceiptEmail(transaction, {
            warranty_months: transaction.warranty_months || 12,
          });
          console.log(
            "✅ Receipt email sent successfully. Message ID:",
            emailResult.messageId,
          );
          console.log("📬 Email details:", emailResult);
        } catch (emailError) {
          console.error("❌ FAILED to send receipt email:");
          console.error("   Error message:", emailError.message);
          console.error("   Error code:", emailError.code);
          console.error("   Error stack:", emailError.stack);
          if (emailError.response) {
            console.error("   SMTP Response:", emailError.response);
          }
        }

        // SEND ADMIN NOTIFICATION
        console.log(`📧 Attempting to send admin notification`);
        try {
          const adminResult = await sendAdminNotification(transaction);
          if (adminResult) {
            console.log(
              "✅ Admin notification sent. Message ID:",
              adminResult.messageId,
            );
          } else {
            console.log("⚠️ Admin notification sent but no result returned");
          }
        } catch (adminError) {
          console.error(
            "❌ FAILED to send admin notification:",
            adminError.message,
          );
        }
      } else {
        console.error(
          `❌ No transaction found in database for tx_ref: ${tx_ref}`,
        );

        // Try to get transaction from Chapa as fallback
        try {
          console.log(
            "📡 Attempting to get transaction from Chapa as fallback",
          );
          // You might want to create a transaction record here if missing
        } catch (fallbackError) {
          console.error("❌ Fallback also failed:", fallbackError);
        }
      }

      console.log("✅ Webhook processed successfully, sending 200 response");
      res.sendStatus(200);
    } else {
      console.log(
        "❌ Payment verification failed - Chapa returned non-success status",
      );
      console.log("   Status from Chapa:", response.data.status);

      // Update as failed
      try {
        await Transaction.updateTransactionStatus(tx_ref, "failed");
        console.log(`✅ Transaction ${tx_ref} marked as failed`);
      } catch (dbError) {
        console.error("❌ Failed to update transaction status:", dbError);
      }

      res.sendStatus(400);
    }
  } catch (error) {
    console.error("🔴🔴🔴 WEBHOOK ERROR 🔴🔴🔴");
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    console.error("Error stack:", error.stack);

    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    }

    if (error.request) {
      console.error("Error request:", error.request);
    }

    console.error("🔴🔴🔴 END ERROR 🔴🔴🔴\n");

    res.sendStatus(500);
  }
});

// ==================== GET TRANSACTION STATUS ====================

router.get("/status/:tx_ref", async (req, res) => {
  try {
    const { tx_ref } = req.params;
    console.log(`🔍 Checking status for transaction: ${tx_ref}`);

    // First check your database
    const transaction = await Transaction.getTransactionByRef(tx_ref);

    if (transaction) {
      console.log("✅ Transaction found in database:", transaction.tx_ref);
      res.json({
        success: true,
        data: transaction,
      });
    } else {
      console.log("⚠️ Transaction not in database, checking Chapa");
      // Fallback to Chapa
      const response = await chapaApi.get(`/transaction/verify/${tx_ref}`);
      res.json({
        success: true,
        data: response.data,
      });
    }
  } catch (error) {
    console.error("🔴 Status error:", error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

// ==================== MANUAL EMAIL RESEND ====================

router.post("/resend-email/:tx_ref", async (req, res) => {
  try {
    const { tx_ref } = req.params;
    console.log(`📧 Manual email resend requested for: ${tx_ref}`);

    const transaction = await Transaction.getTransactionByRef(tx_ref);

    if (!transaction) {
      console.error(`❌ Transaction not found: ${tx_ref}`);
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    console.log("📦 Transaction found:", JSON.stringify(transaction, null, 2));

    const emailResult = await sendReceiptEmail(transaction, {
      warranty_months: transaction.warranty_months || 12,
    });

    console.log("✅ Manual email resend successful:", emailResult.messageId);

    res.json({
      success: true,
      message: "Receipt email resent successfully",
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error("🔴 Email resend error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend email",
      error: error.message,
    });
  }
});

module.exports = router;
