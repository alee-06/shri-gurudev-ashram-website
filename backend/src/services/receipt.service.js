const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const maskId = require("../utils/maskId");

/**
 * Generate donation receipt PDF
 * Uses donor snapshot from donation record (not user)
 */
exports.generateDonationReceipt = (donation) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const fileName = `receipt_${donation._id}.pdf`;
      const receiptsDir = path.join(__dirname, "../../receipts");
      
      // Ensure receipts directory exists
      if (!fs.existsSync(receiptsDir)) {
        fs.mkdirSync(receiptsDir, { recursive: true });
      }
      
      const filePath = path.join(receiptsDir, fileName);

      doc.pipe(fs.createWriteStream(filePath));

      // Header
      doc.fontSize(20).text("Shri Gurudev Ashram", { align: "center" });
      doc.fontSize(14).text("Donation Receipt", { align: "center" });
      doc.moveDown();

      // Divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown();

      // Receipt details
      doc.fontSize(12);
      doc.text(`Receipt No: ${donation.receiptNumber}`);
      doc.text(`Date: ${new Date(donation.createdAt).toLocaleDateString("en-IN")}`);
      doc.moveDown();

      // Donor details (from snapshot)
      doc.fontSize(14).text("Donor Details", { underline: true });
      doc.fontSize(12);
      doc.text(`Name: ${donation.donor.anonymousDisplay ? "Anonymous Donor" : donation.donor.name}`);
      doc.text(`Mobile: ${donation.donor.mobile}`);
      if (donation.donor.email) {
        doc.text(`Email: ${donation.donor.email}`);
      }
      doc.text(`Address: ${donation.donor.address}`);
      doc.text(`Date of Birth: ${new Date(donation.donor.dob).toLocaleDateString("en-IN")}`);
      doc.text(`${donation.donor.idType}: ${maskId(donation.donor.idNumber)}`);
      doc.moveDown();

      // Donation details
      doc.fontSize(14).text("Donation Details", { underline: true });
      doc.fontSize(12);
      doc.text(`Donation Head: ${donation.donationHead.name}`);
      doc.text(`Amount: ₹${donation.amount.toLocaleString("en-IN")}`);
      doc.text(`Payment ID: ${donation.paymentId || "-"}`);
      doc.text(`Status: SUCCESS`);
      doc.moveDown();

      // Divider
      doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
      doc.moveDown();

      // Footer
      doc.fontSize(10).text("Thank you for your generous contribution.", {
        align: "center",
      });
      doc.text("May your seva be blessed.", { align: "center" });

      doc.end();
      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};
