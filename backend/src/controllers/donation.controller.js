const Donation = require("../models/Donation");
const razorpay = require("../config/razorpay");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcrypt");
const { generateDonationReceipt } = require("../services/receipt.service");
const { sendDonationReceiptEmail } = require("../services/email.service");

/**
 * Helper: Validate government ID
 */
const validateGovtId = (idType, idNumber) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const aadhaarRegex = /^[0-9]{12}$/;

  if (!["PAN", "AADHAAR"].includes(idType)) {
    return { valid: false, message: "Invalid ID type" };
  }

  if (idType === "PAN" && !panRegex.test(idNumber)) {
    return { valid: false, message: "Invalid PAN number format" };
  }

  if (idType === "AADHAAR" && !aadhaarRegex.test(idNumber)) {
    return { valid: false, message: "Invalid Aadhaar number format" };
  }

  return { valid: true };
};

/**
 * Helper: Validate age (must be 18+)
 */
const validateAge = (dob) => {
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) {
    return { valid: false, message: "Invalid date of birth" };
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  if (age < 18) {
    return { valid: false, message: "Donor must be 18 years or older" };
  }

  return { valid: true };
};

/**
 * Send OTP for donation verification
 * POST /donations/send-otp
 */
exports.sendDonationOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({ message: "Mobile number is required" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpHash = await bcrypt.hash(otp.toString(), 10);

    // Store OTP with 5 min expiry
    await Otp.create({
      mobile,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Console log for development (replace with SMS/WhatsApp later)
    console.log(`[DONATION OTP] Mobile: ${mobile}, OTP: ${otp}`);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

/**
 * Verify OTP for donation
 * POST /donations/verify-otp
 */
exports.verifyDonationOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    const record = await Otp.findOne({ mobile }).sort({ _id: -1 });

    if (!record) {
      return res.status(400).json({ message: "OTP not found. Please request a new one." });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteMany({ mobile });
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    const isValid = await bcrypt.compare(otp.toString(), record.otpHash);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete used OTP
    await Otp.deleteMany({ mobile });

    res.json({ 
      verified: true, 
      message: "OTP verified successfully" 
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ message: "OTP verification failed" });
  }
};

/**
 * Create donation record
 * POST /donations/create
 * Accepts full donor object and stores snapshot
 */
exports.createDonation = async (req, res) => {
  try {
    const { donor, donationHead, amount, otpVerified } = req.body;

    // Validate required fields
    if (!donor || !donationHead || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid donation data" });
    }

    // Validate donor object
    const { name, mobile, email, emailOptIn, address, anonymousDisplay, dob, idType, idNumber } = donor;

    if (!name || !mobile || !address || !dob || !idType || !idNumber) {
      return res.status(400).json({ message: "Missing required donor details" });
    }

    // Validate donationHead object
    if (!donationHead.id || !donationHead.name) {
      return res.status(400).json({ message: "Invalid donation head format" });
    }

    // Validate government ID
    const idValidation = validateGovtId(idType, idNumber);
    if (!idValidation.valid) {
      return res.status(400).json({ message: idValidation.message });
    }

    // Validate age
    const ageValidation = validateAge(dob);
    if (!ageValidation.valid) {
      return res.status(400).json({ message: ageValidation.message });
    }

    // Create donation with donor snapshot
    const donation = await Donation.create({
      user: req.user?.id || null,
      donor: {
        name,
        mobile,
        email: email || undefined,
        emailOptIn: emailOptIn || false,
        address,
        anonymousDisplay: anonymousDisplay || false,
        dob: new Date(dob),
        idType,
        idNumber,
      },
      donationHead: {
        id: donationHead.id,
        name: donationHead.name,
      },
      amount,
      otpVerified: otpVerified || false,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Donation initiated",
      donationId: donation._id,
      status: donation.status,
    });
  } catch (error) {
    console.error("Create donation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createDonationOrder = async (req, res) => {
  try {
    const { donationId } = req.body;

    if (!donationId) {
      return res.status(400).json({ message: "Donation ID required" });
    }

    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    const options = {
      amount: donation.amount * 100,
      currency: "INR",
      receipt: donation._id.toString().slice(-12),
    };

    const order = await razorpay.orders.create(options);

    donation.razorpayOrderId = order.id;
    await donation.save();

    res.json({
      razorpayOrderId: order.id,
      amount: options.amount, // Return amount in paise for Razorpay
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

/**
 * Verify Razorpay payment after frontend payment completion
 * This is called by frontend after successful Razorpay checkout
 * Verifies signature and updates donation status
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, donationId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !donationId) {
      return res.status(400).json({ message: "Missing payment verification data" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    // Find and update donation
    const donation = await Donation.findById(donationId);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Already processed
    if (donation.status === "SUCCESS") {
      return res.json({ 
        success: true, 
        message: "Payment already verified",
        status: donation.status 
      });
    }

    // Update donation status
    donation.status = "SUCCESS";
    donation.paymentId = razorpay_payment_id;
    donation.transactionRef = razorpay_payment_id;
    donation.receiptNumber = `GRD-${new Date().getFullYear()}-${donation._id
      .toString()
      .slice(-6)
      .toUpperCase()}`;

    await donation.save();

    // Generate receipt using donor snapshot (not user)
    try {
      const receiptPath = await generateDonationReceipt(donation);
      donation.receiptUrl = receiptPath;
      await donation.save();

      // Send email if donor has email
      if (donation.donor.email) {
        try {
          await sendDonationReceiptEmail(donation.donor.email, receiptPath);
        } catch (emailErr) {
          console.error("Receipt email failed:", emailErr.message);
        }
      }
    } catch (receiptErr) {
      console.error("Receipt generation failed:", receiptErr.message);
    }

    res.json({ 
      success: true, 
      message: "Payment verified successfully",
      status: donation.status,
      receiptNumber: donation.receiptNumber
    });

  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

/**
 * Get user's donations (JWT protected)
 * GET /user/donations
 */
exports.getUserDonations = async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id })
      .select("_id donationHead donor.name donor.anonymousDisplay amount status createdAt receiptUrl receiptNumber")
      .sort({ createdAt: -1 });

    // Format response with display name handling
    const formattedDonations = donations.map(d => ({
      _id: d._id,
      donationHead: d.donationHead,
      donorName: d.donor.anonymousDisplay ? "Anonymous" : d.donor.name,
      amount: d.amount,
      status: d.status,
      createdAt: d.createdAt,
      receiptUrl: d.receiptUrl,
      receiptNumber: d.receiptNumber,
    }));

    res.json(formattedDonations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donations" });
  }
};

/**
 * Get donation status
 * PUBLIC endpoint - no auth required
 * Used by Step5Success polling for both guest and logged-in users
 * Safe: only returns status, no sensitive data
 */
exports.getDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format to prevent DB errors
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const donation = await Donation.findById(id).select("status donationHead amount receiptNumber");

    if (!donation) {
      return res.status(404).json({ status: "NOT_FOUND" });
    }

    res.json({ 
      status: donation.status,
      donationHead: donation.donationHead,
      amount: donation.amount,
      receiptNumber: donation.receiptNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch donation status" });
  }
};

/**
 * Download donation receipt
 * PUBLIC endpoint - accessible via donationId (acts as access token)
 * Streams the existing PDF - does NOT regenerate
 * Only returns receipt if donation.status === "SUCCESS"
 */
exports.downloadReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    const donation = await Donation.findById(id);

    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Check if donation is successful
    if (donation.status !== "SUCCESS") {
      return res
        .status(403)
        .json({ message: "Receipt not available for this donation" });
    }

    // Check if receipt exists
    if (!donation.receiptUrl) {
      return res.status(404).json({ message: "Receipt not generated yet" });
    }

    // Construct receipt file path
    const receiptPath = path.join(
      __dirname,
      "../../receipts",
      path.basename(donation.receiptUrl)
    );

    if (!fs.existsSync(receiptPath)) {
      return res.status(404).json({ message: "Receipt file not found" });
    }

    // Set headers for PDF download
    const filename = `receipt-${donation.receiptNumber || donation._id}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Stream the file
    const fileStream = fs.createReadStream(receiptPath);
    fileStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to download receipt" });
  }
};
