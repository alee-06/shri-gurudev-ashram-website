const router = require("express").Router();
const { sendOtp, verifyOtp, getMe } = require("../controllers/auth.controller");
const { otpLimiter } = require("../middlewares/rateLimit");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/send-otp", otpLimiter, sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", authMiddleware, getMe);

module.exports = router;
