import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Website Admin Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Website Admin
          </h2>
          <p className="text-gray-600 mb-6">
            Manage public website content
          </p>
          <ul className="space-y-2 mb-8 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Gallery
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Events
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Activities
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Announcement Banner
            </li>
          </ul>
          <button
            onClick={() => navigate("/admin/website")}
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Enter Website Admin
          </button>
        </div>

        {/* System Admin Card */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            System Admin
          </h2>
          <p className="text-gray-600 mb-6">
            Manage donations and reports
          </p>
          <ul className="space-y-2 mb-8 text-gray-700">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Donations
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Donors
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Receipts
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
              Reports
            </li>
          </ul>
          <button
            onClick={() => navigate("/admin/system")}
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Enter System Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
