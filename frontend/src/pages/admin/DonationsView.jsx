import { useState, useMemo } from "react";
import { useDonations } from "../../context/DonationsContext";
import { formatCurrency, formatDate } from "../../utils/helpers";

const DonationsView = () => {
  const { donations } = useDonations();
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [causeFilter, setCauseFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique causes
  const causes = useMemo(() => {
    const uniqueCauses = new Set(donations.map(d => d.cause));
    return Array.from(uniqueCauses).sort();
  }, [donations]);

  // Filter donations
  const filteredDonations = useMemo(() => {
    return donations.filter(donation => {
      // Date range filter
      if (dateFrom && donation.date < dateFrom) return false;
      if (dateTo && donation.date > dateTo) return false;

      // Cause filter
      if (causeFilter !== "all" && donation.cause !== causeFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return donation.donorName.toLowerCase().includes(query);
      }

      return true;
    });
  }, [donations, dateFrom, dateTo, causeFilter, searchQuery]);

  const handleDownloadReceipt = (donation) => {
    // UI only - no actual download
    alert(`Receipt download for donation #${donation.id} (UI only)`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
        <p className="text-gray-600 text-sm mt-1">
          View and manage all donation records
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Date From */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Cause Filter */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Cause
            </label>
            <select
              value={causeFilter}
              onChange={(e) => setCauseFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Causes</option>
              {causes.map(cause => (
                <option key={cause} value={cause}>{cause}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Search Donor
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Clear Filters */}
        {(dateFrom || dateTo || causeFilter !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setDateFrom("");
              setDateTo("");
              setCauseFilter("all");
              setSearchQuery("");
            }}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Donor Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cause
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receipt
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonations.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  No donations found
                </td>
              </tr>
            ) : (
              filteredDonations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(donation.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.donorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {donation.cause}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        donation.paymentStatus === "Success"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {donation.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {donation.receiptAvailable ? (
                      <button
                        onClick={() => handleDownloadReceipt(donation)}
                        className="text-amber-600 hover:text-amber-700 font-medium"
                      >
                        Download
                      </button>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total Records: {filteredDonations.length}
          </span>
          <span className="text-sm font-semibold text-amber-900">
            Total Amount: {formatCurrency(
              filteredDonations.reduce((sum, d) => sum + d.amount, 0)
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default DonationsView;
