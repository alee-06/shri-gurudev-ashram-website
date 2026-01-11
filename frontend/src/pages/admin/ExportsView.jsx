import { useState } from "react";
import { useDonations } from "../../context/DonationsContext";

const ExportsView = () => {
  const { donations, donors } = useDonations();
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleExportDonations = () => {
    // UI only - no actual export
    showToast("Export generated successfully");
  };

  const handleExportDonors = () => {
    // UI only - no actual export
    showToast("Export generated successfully");
  };

  const handleExportReceipts = () => {
    // UI only - no actual export
    showToast("Export generated successfully");
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Exports</h1>
          <p className="text-gray-600 text-sm mt-1">
            Export donation data and reports
          </p>
        </div>

        <div className="space-y-6">
          {/* Export Donations */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Export Donations</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Export all donation records to CSV format
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total records: {donations.length}
                </p>
              </div>
              <button
                onClick={handleExportDonations}
                className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
              >
                Export CSV
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Includes: Date, Donor Name, Amount, Cause, Payment Status
            </div>
          </div>

          {/* Export Donors */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Export Donors</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Export all donor records to CSV format
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total records: {donors.length}
                </p>
              </div>
              <button
                onClick={handleExportDonors}
                className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
              >
                Export CSV
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Includes: Name, Mobile, Government ID Type, Total Donated
            </div>
          </div>

          {/* Export Receipts */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Export Receipts</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Export all receipts as PDF documents
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Total receipts: {donations.filter(d => d.receiptAvailable).length}
                </p>
              </div>
              <button
                onClick={handleExportReceipts}
                className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
              >
                Export PDF
              </button>
            </div>
            <div className="text-xs text-gray-500">
              Generates PDF files for all available receipts
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{toast}</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ExportsView;
