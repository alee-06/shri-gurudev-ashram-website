import { useState } from "react";
import PrimaryButton from "../../../components/PrimaryButton";
import { donationHeads, presetAmounts } from "../../../data/dummyData";
import { formatCurrency } from "../../../utils/helpers";

const Step3DonationDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});

  // Clear donation IDs when amount changes (invalidates previous order)
  const clearDonationIds = () => {
    if (data.donationId || data.razorpayOrderId) {
      updateData({
        donationId: null,
        razorpayOrderId: null,
        razorpayOrderAmount: null,
        razorpayKey: null,
      });
    }
  };

  const handleDonationHeadSelect = (head) => {
    updateData({ donationHead: head });
    if (errors.donationHead) {
      setErrors((prev) => ({ ...prev, donationHead: "" }));
    }
  };

  const handlePresetAmount = (amount) => {
    clearDonationIds();
    updateData({ amount, customAmount: "" });
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    clearDonationIds();
    updateData({ customAmount: value, amount: value ? parseInt(value) : 0 });
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!data.donationHead) {
      newErrors.donationHead = "Please select a donation head";
    }

    if (!data.amount || data.amount < 1) {
      newErrors.amount = "Please enter a donation amount";
    } else if (data.amount < 10) {
      newErrors.amount = "Minimum donation amount is ₹10";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
        Donation Details
      </h2>

      <div className="space-y-6">
        {/* Donation Head Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Donation Head <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donationHeads.map((head) => (
              <button
                key={head.id}
                onClick={() => handleDonationHeadSelect(head)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.donationHead?.id === head.id
                    ? "border-amber-600 bg-amber-50"
                    : "border-gray-200 hover:border-amber-300 bg-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{head.icon}</span>
                  <div>
                    <div className="font-semibold text-amber-900">
                      {head.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {head.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.donationHead && (
            <p className="mt-2 text-sm text-red-600">{errors.donationHead}</p>
          )}
        </div>

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Donation Amount <span className="text-red-500">*</span>
          </label>

          {/* Preset Amounts */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {presetAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handlePresetAmount(amount)}
                className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                  data.amount === amount && !data.customAmount
                    ? "border-amber-600 bg-amber-50 text-amber-900"
                    : "border-gray-200 hover:border-amber-300 bg-white text-gray-700"
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">
              Or enter custom amount:
            </label>
            <input
              type="text"
              value={data.customAmount}
              onChange={handleCustomAmount}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          {errors.amount && (
            <p className="mt-2 text-sm text-red-600">{errors.amount}</p>
          )}

          {data.amount > 0 && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-amber-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-amber-700">
                  {formatCurrency(data.amount)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <PrimaryButton
            type="button"
            onClick={prevStep}
            variant="outline"
            className="flex-1"
          >
            Back
          </PrimaryButton>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!data.donationHead || !data.amount}
            className="flex-1"
          >
            Proceed to Payment
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Step3DonationDetails;
