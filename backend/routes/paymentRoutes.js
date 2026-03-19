const express = require("express");
const router = express.Router();
const Chapa = require("chapa-nodejs").default;
const Transaction = require("../models/Transaction");
const { createSaleFromTransaction } = require("../controllers/saleController");

// Initialize Chapa
const chapa = new Chapa({
  secretKey: process.env.CHAPA_SECRET_KEY,
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
      product_id,
      customer_phone,
      metadata = {},
    } = req.body;

    // Generate unique transaction reference
    const tx_ref = `CHALA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Prepare payment data
    const paymentData = {
      amount: amount.toString(),
      currency: "ETB",
      email: email,
      first_name: first_name,
      last_name: last_name || "",
      tx_ref: tx_ref,
      callback_url: `${process.env.BASE_URL}/api/payments/verify`,
      return_url: `${process.env.FRONTEND_URL}/payment-success`,
      customization: {
        title: "Chala Mobile Purchase",
        description: `Payment for ${product_name}`,
      },
      metadata: {
        ...metadata,
        product_id,
        customer_phone,
      },
    };

    console.log("Initializing payment:", paymentData);

    // Initialize with Chapa
    const response = await chapa.initialize(paymentData);

    if (response.status === "success") {
      // Save transaction to database
      await Transaction.saveTransaction({
        tx_ref,
        amount,
        customer_name: `${first_name} ${last_name}`.trim(),
        customer_email: email,
        customer_phone,
        product_name,
        product_id,
        status: "pending",
      });

      res.json({
        success: true,
        checkout_url: response.data.checkout_url,
        tx_ref,
      });
    } else {
      throw new Error("Failed to initialize payment");
    }
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Payment initialization failed",
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

    if (
      verifyResponse.status === "success" &&
      verifyResponse.data.status === "success"
    ) {
      // Update transaction status
      await Transaction.updateTransactionStatus(
        tx_ref,
        "completed",
        verifyResponse.data.transaction_id,
      );

      // Create sale in your system
      const transaction = await Transaction.getTransactionByRef(tx_ref);
      if (transaction) {
        await createSaleFromTransaction(transaction);
      }

      // Send success response to Chapa
      res.sendStatus(200);
    } else {
      await Transaction.updateTransactionStatus(tx_ref, "failed");
      res.sendStatus(400);
    }
  } catch (error) {
    console.error("Verification error:", error);
    await Transaction.updateTransactionStatus(tx_ref, "failed");
    res.sendStatus(500);
  }
});

// Get transaction status
router.get("/status/:tx_ref", async (req, res) => {
  try {
    const transaction = await Transaction.getTransactionByRef(
      req.params.tx_ref,
    );
    if (!transaction) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
