const router = require("express").Router();
const authMiddleware = require("../middlewares/auth.middleware");
const optionalAuthMiddleware = require("../middlewares/optionalAuth.middleware");
const {
  createDonation,
  createDonationOrder,
  verifyPayment,
  getDonationStatus,
  downloadReceipt,
  sendDonationOtp,
  verifyDonationOtp,
} = require("../controllers/donation.controller");

// OTP endpoints for donation verification (no auth required)
router.post("/send-otp", sendDonationOtp);
router.post("/verify-otp", verifyDonationOtp);

// Donation creation - uses optional auth (works for both guests and logged-in users)
// If user is logged in, donation will be linked to their account
router.post("/create", optionalAuthMiddleware, createDonation);
router.post("/create-order", optionalAuthMiddleware, createDonationOrder);

// Payment verification (called by frontend after Razorpay checkout success)
router.post("/verify-payment", optionalAuthMiddleware, verifyPayment);

// Public endpoints - no auth required (donationId acts as access token)
router.get("/:id/status", getDonationStatus);
router.get("/:id/receipt", downloadReceipt);

module.exports = router;
