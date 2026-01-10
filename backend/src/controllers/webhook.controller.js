const crypto = require("crypto");
const Donation = require("../models/Donation");

exports.handleRazorpayWebhook = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers["x-razorpay-signature"];

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  if (signature !== expectedSignature) {
    return res.status(400).json({ message: "Invalid signature" });
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const orderId = payment.order_id;
    const paymentId = payment.id;

    const donation = await Donation.findOne({ razorpayOrderId: orderId });

    if (donation) {
      donation.status = "SUCCESS";
      donation.paymentId = paymentId;
      donation.transactionRef = paymentId;
      await donation.save();
    }
  }

  res.json({ status: "ok" });
};
