const Donation = require("../models/Donation");
const User = require("../models/User");
const maskId = require("../utils/maskId");

/**
 * Helper: Mask sensitive donor data for API responses
 * Masks PAN/Aadhaar in donor object
 */
const maskDonorData = (donor) => {
  if (!donor) return donor;
  const donorObj = donor.toObject ? donor.toObject() : { ...donor };
  return {
    ...donorObj,
    idNumber: maskId(donorObj.idType, donorObj.idNumber),
  };
};

exports.getAllDonations = async (req, res) => {
  const donations = await Donation.find()
    .populate("user", "fullName email mobile")
    .sort({ createdAt: -1 });

  // Mask sensitive donor data before sending response
  const maskedDonations = donations.map((d) => {
    const donationObj = d.toObject();
    return {
      ...donationObj,
      donor: maskDonorData(donationObj.donor),
    };
  });

  res.json(maskedDonations);
};

exports.getAllDonors = async (req, res) => {
  const donors = await User.find({ role: "USER" }).select(
    "fullName email mobile createdAt",
  );

  res.json(donors);
};

exports.getReports = async (req, res) => {
  const totalAmount = await Donation.aggregate([
    { $match: { status: "SUCCESS" } },
    { $group: { _id: null, sum: { $sum: "$amount" } } },
  ]);

  res.json({
    totalAmount: totalAmount[0]?.sum || 0,
  });
};
