import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);
  const isAdminHome = location.pathname === "/admin";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Context Switch Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 mr-4">
                Context:
              </span>
              <button
                className="px-4 py-2 bg-amber-600 text-white rounded-md font-medium text-sm cursor-default"
                disabled
              >
                Donation
              </button>
              <div className="relative">
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md font-medium text-sm cursor-not-allowed opacity-60"
                  disabled
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Shop (Coming Soon)
                </button>
                {showTooltip && (
                  <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap z-10">
                    Shop module is not active yet
                  </div>
                )}
              </div>
            </div>
            {!isAdminHome && (
              <button
                onClick={() => navigate("/admin")}
                className="text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                ← Back to Admin Home
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
