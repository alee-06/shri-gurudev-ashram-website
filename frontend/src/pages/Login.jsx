import SectionHeading from "../components/SectionHeading";
import { useState } from "react";

const Login = () => {
  const [role, setRole] = useState("user");

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-6">
        <SectionHeading
          title="Login"
          subtitle="Select your role and sign in"
          center={true}
        />

        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-center space-x-4">
            {[
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ].map((opt) => (
              <label
                key={opt.value}
                className="flex items-center space-x-2 text-sm font-medium text-amber-900"
              >
                <input
                  type="radio"
                  name="role"
                  value={opt.value}
                  checked={role === opt.value}
                  onChange={() => setRole(opt.value)}
                  className="text-amber-600 focus:ring-amber-500"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
            aria-label={`Login as ${role}`}
          >
            Login as {role === "admin" ? "Admin" : "User"}
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

export default Login;
