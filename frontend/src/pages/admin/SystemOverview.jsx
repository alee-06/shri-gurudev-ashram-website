import { useDonations } from "../../context/DonationsContext";
import { formatCurrency } from "../../utils/helpers";

const SystemOverview = () => {
  const { donations, donors } = useDonations();

  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const successfulDonations = donations.filter(d => d.paymentStatus === "Success").length;
  const pendingDonations = donations.filter(d => d.paymentStatus === "Pending").length;
  const totalDonors = donors.length;
  const anonymousDonations = donations.filter(d => d.donorName === "Anonymous").length;

  // Top causes
  const causeStats = donations.reduce((acc, donation) => {
    acc[donation.cause] = (acc[donation.cause] || 0) + donation.amount;
    return acc;
  }, {});
  const topCauses = Object.entries(causeStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600 text-sm mt-1">
          Dashboard summary of donations and donors
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Donations</div>
          <div className="text-2xl font-bold text-gray-900">{totalDonations}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Amount</div>
          <div className="text-2xl font-bold text-amber-900">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Donors</div>
          <div className="text-2xl font-bold text-gray-900">{totalDonors}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-green-600">
            {totalDonations > 0 
              ? Math.round((successfulDonations / totalDonations) * 100) 
              : 0}%
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-700 mb-1">Successful</div>
            <div className="text-2xl font-bold text-green-900">{successfulDonations}</div>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-sm font-medium text-yellow-700 mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-900">{pendingDonations}</div>
          </div>
        </div>
      </div>

      {/* Top Causes */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Causes</h2>
        <div className="space-y-3">
          {topCauses.length === 0 ? (
            <p className="text-sm text-gray-500">No data available</p>
          ) : (
            topCauses.map(([cause, amount], index) => (
              <div key={cause} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900">{cause}</span>
                </div>
                <span className="text-sm font-semibold text-amber-900">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Anonymous Donations</div>
            <div className="text-xl font-bold text-gray-900">{anonymousDonations}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Average Donation</div>
            <div className="text-xl font-bold text-amber-900">
              {totalDonations > 0 
                ? formatCurrency(Math.round(totalAmount / totalDonations)) 
                : formatCurrency(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
