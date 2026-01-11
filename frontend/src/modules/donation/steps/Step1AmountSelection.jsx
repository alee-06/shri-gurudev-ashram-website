import { useState } from 'react';
import PrimaryButton from '../../../components/PrimaryButton';
import { presetAmounts } from '../../../data/dummyData';
import { formatCurrency } from '../../../utils/helpers';

const Step1AmountSelection = ({ data, updateData, nextStep }) => {
  const [errors, setErrors] = useState({});

  const handlePresetAmount = (amount) => {
    updateData({ amount, customAmount: '' });
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleCustomAmount = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    updateData({ customAmount: value, amount: value ? parseInt(value) : 0 });
    if (errors.amount) {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    if (!data.amount || data.amount < 1) {
      newErrors.amount = 'Please enter a donation amount';
    } else if (data.amount < 10) {
      newErrors.amount = 'Minimum donation amount is ₹10';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
        Select Donation Amount
      </h2>

      <div className="space-y-6">
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
                    ? 'border-amber-600 bg-amber-50 text-amber-900'
                    : 'border-gray-200 hover:border-amber-300 bg-white text-gray-700'
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Or enter custom amount:</label>
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
                <span className="font-semibold text-amber-900">Total Amount:</span>
                <span className="text-2xl font-bold text-amber-700">
                  {formatCurrency(data.amount)}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="pt-4">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={!data.amount || data.amount < 10}
            className="w-full"
          >
            Continue
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default Step1AmountSelection;

