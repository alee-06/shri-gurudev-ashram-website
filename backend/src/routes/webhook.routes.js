const express = require("express");
const crypto = require("crypto");
const Donation = require("../models/Donation");

const router = express.Router();

router.post("/razorpay", async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Get Razorpay signature
    const razorpaySignature = req.headers["x-razorpay-signature"];

    // 2. Compute expected signature using RAW body
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(req.body)
      .digest("hex");

    // 3. Verify signature
    if (razorpaySignature !== expectedSignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    // 4. Parse event
    const event = JSON.parse(req.body.toString());

    // 5. Handle successful payment
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;

      const donation = await Donation.findOne({
        razorpayOrderId: payment.order_id,
      });

      // Idempotency check (VERY IMPORTANT)
      if (donation && donation.status !== "SUCCESS") {
        donation.status = "SUCCESS";
        donation.paymentId = payment.id;
        donation.transactionRef = payment.id;
        await donation.save();
      }
    }

    // 6. Acknowledge webhook
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
});

module.exports = router;
