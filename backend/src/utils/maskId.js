/**
 * Mask PAN or Aadhaar numbers for display
 * @param {string} idType - "PAN" or "AADHAAR"
 * @param {string} idNumber - The ID number to mask
 * @returns {string} Masked ID
 *
 * Examples:
 * - Aadhaar: "123456789012" → "**** **** 9012"
 * - PAN: "ABCDE1234F" → "******1234"
 */
const maskId = (idType, idNumber) => {
  if (!idNumber) return "****";

  const id = idNumber.toString().trim();

  if (id.length <= 4) return "****";

  if (idType === "AADHAAR") {
    // Aadhaar: Show last 4 digits with format "**** **** 1234"
    const last4 = id.slice(-4);
    return `**** **** ${last4}`;
  }

  if (idType === "PAN") {
    // PAN: Show last 4 characters with format "******1234"
    const last4 = id.slice(-4);
    return `******${last4}`;
  }

  // Default fallback: mask all but last 4
  return "****" + id.slice(-4);
};

module.exports = maskId;
