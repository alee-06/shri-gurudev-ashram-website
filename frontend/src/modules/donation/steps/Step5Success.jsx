import { Link } from 'react-router-dom';
import PrimaryButton from '../../../components/PrimaryButton';
import { formatCurrency } from '../../../utils/helpers';
import { useDonations } from '../../../context/DonationsContext';
import { useEffect, useRef } from 'react';

const Step5Success = ({ data, resetFlow }) => {
  const { addDonation } = useDonations();
  const hasSavedRef = useRef(false);

  // Save donation when component mounts (only once)
  useEffect(() => {
    if (!hasSavedRef.current && data.transactionId && data.amount > 0) {
      addDonation(data);
      hasSavedRef.current = true;
    }
  }, [data.transactionId, data.amount, addDonation]);
  const handleDownloadReceipt = () => {
    // Mock receipt download - in production, this would generate and download a PDF
    const receiptData = {
      transactionId: data.transactionId,
      donorName: data.name,
      amount: data.amount,
      cause: data.donationHead?.name,
      date: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };
    
    // Simulate download
    console.log('Downloading receipt:', receiptData);
    alert('Receipt downloaded successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-amber-900 mb-2">
          Donation Successful!
        </h2>
        <p className="text-gray-600">
          Thank you for your generous contribution
        </p>
      </div>

      <div className="bg-amber-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold text-amber-900 mb-4">Donation Details</h3>
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-gray-700">Transaction ID:</span>
            <span className="font-semibold text-amber-900 font-mono">
              {data.transactionId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Donation Head:</span>
            <span className="font-semibold text-amber-900">{data.donationHead?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Amount:</span>
            <span className="font-bold text-amber-700 text-lg">
              {formatCurrency(data.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Date:</span>
            <span className="font-semibold text-amber-900">
              {new Date().toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <PrimaryButton onClick={handleDownloadReceipt} className="w-full">
          Download Receipt
        </PrimaryButton>
        
        {/* Receipt Delivery Status */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
          {data.emailOptIn && data.email && data.emailVerified && (
            <div className="flex items-center space-x-2 text-sm text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Receipt sent via Email</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Receipt sent via WhatsApp</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Link to="/" className="flex-1">
          <PrimaryButton variant="outline" className="w-full">
            Back to Home
          </PrimaryButton>
        </Link>
        <PrimaryButton onClick={resetFlow} className="flex-1">
          Make Another Donation
        </PrimaryButton>
      </div>

      <p className="text-sm text-gray-600 mt-6">
        Thank you for your generous contribution.
        <br />
        May you be blessed with peace, prosperity, and spiritual growth!
      </p>
    </div>
  );
};

export default Step5Success;

