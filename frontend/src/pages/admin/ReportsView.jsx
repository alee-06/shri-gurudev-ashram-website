import { useMemo } from "react";
import { useDonations } from "../../context/DonationsContext";
import { formatCurrency } from "../../utils/helpers";

const ReportsView = () => {
  const { donations, donors } = useDonations();

  // Get current month donations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const currentMonthDonations = useMemo(() => {
    return donations.filter(donation => {
      const donationDate = new Date(donation.date);
      return donationDate.getMonth() === currentMonth && donationDate.getFullYear() === currentYear;
    });
  }, [donations, currentMonth, currentYear]);

  // Calculate summary metrics
  const totalDonationsLifetime = donations.length;
  const totalAmountLifetime = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonationsCurrentMonth = currentMonthDonations.length;
  const totalAmountCurrentMonth = currentMonthDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalDonors = donors.length;

  // Top donation cause
  const topCause = useMemo(() => {
    const causeStats = donations.reduce((acc, donation) => {
      acc[donation.cause] = (acc[donation.cause] || 0) + donation.amount;
      return acc;
    }, {});
    const sorted = Object.entries(causeStats).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? { cause: sorted[0][0], amount: sorted[0][1] } : null;
  }, [donations]);

  // Cause-wise donation summary
  const causeSummary = useMemo(() => {
    const causeStats = donations.reduce((acc, donation) => {
      if (!acc[donation.cause]) {
        acc[donation.cause] = { count: 0, amount: 0 };
      }
      acc[donation.cause].count += 1;
      acc[donation.cause].amount += donation.amount;
      return acc;
    }, {});
    return Object.entries(causeStats)
      .map(([cause, stats]) => ({ cause, ...stats }))
      .sort((a, b) => b.amount - a.amount);
  }, [donations]);

  // Monthly donation summary (last 12 months)
  const monthlySummary = useMemo(() => {
    const monthStats = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    donations.forEach(donation => {
      const date = new Date(donation.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth()).padStart(2, '0')}`;
      const monthLabel = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      if (!monthStats[monthKey]) {
        monthStats[monthKey] = { month: monthLabel, count: 0, amount: 0, dateKey: date };
      }
      monthStats[monthKey].count += 1;
      monthStats[monthKey].amount += donation.amount;
    });

    return Object.values(monthStats)
      .sort((a, b) => b.dateKey - a.dateKey)
      .slice(0, 12)
      .map(({ month, count, amount }) => ({ month, count, amount }));
  }, [donations]);

  // Anonymous vs Named donations
  const anonymousCount = donations.filter(d => d.donorName === "Anonymous").length;
  const namedCount = donations.length - anonymousCount;
  const anonymousAmount = donations
    .filter(d => d.donorName === "Anonymous")
    .reduce((sum, d) => sum + d.amount, 0);
  const namedAmount = donations
    .filter(d => d.donorName !== "Anonymous")
    .reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 text-sm mt-1">
          View donation reports and analytics
        </p>
      </div>

      {/* Summary Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Donations</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalDonationsLifetime}</div>
          <div className="text-xs text-gray-600">Lifetime</div>
          <div className="text-lg font-semibold text-amber-900 mt-2">
            {formatCurrency(totalAmountLifetime)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Current Month</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalDonationsCurrentMonth}</div>
          <div className="text-xs text-gray-600">Donations</div>
          <div className="text-lg font-semibold text-amber-900 mt-2">
            {formatCurrency(totalAmountCurrentMonth)}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Total Donors</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalDonors}</div>
          <div className="text-xs text-gray-600">Registered</div>
        </div>

        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <div className="text-sm font-medium text-gray-500 mb-1">Top Cause</div>
          <div className="text-lg font-bold text-gray-900 mb-1 truncate">
            {topCause ? topCause.cause : "N/A"}
          </div>
          <div className="text-sm font-semibold text-amber-900 mt-2">
            {topCause ? formatCurrency(topCause.amount) : formatCurrency(0)}
          </div>
        </div>
      </div>

      {/* Cause-wise Summary */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cause-wise Donation Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cause
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {causeSummary.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                causeSummary.map((item) => (
                  <tr key={item.cause} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.cause}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Donation Summary (Last 12 Months)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlySummary.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                monthlySummary.map((item) => (
                  <tr key={item.month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {item.count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Anonymous vs Named */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Anonymous vs Named Donations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500 mb-2">Anonymous Donations</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{anonymousCount}</div>
            <div className="text-sm font-semibold text-amber-900">
              {formatCurrency(anonymousAmount)}
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm font-medium text-gray-500 mb-2">Named Donations</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{namedCount}</div>
            <div className="text-sm font-semibold text-amber-900">
              {formatCurrency(namedAmount)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
