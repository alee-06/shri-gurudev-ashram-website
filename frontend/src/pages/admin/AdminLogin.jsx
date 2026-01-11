import SectionHeading from "../../components/SectionHeading";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-6">
        <SectionHeading
          title="Admin Login"
          subtitle="Access admin dashboard"
          center={true}
        />

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter phone"
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Login as Admin
          </button>

          <p className="text-xs text-center text-gray-600">
            Placeholder screen — authentication and role-based access will be
            added later.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
