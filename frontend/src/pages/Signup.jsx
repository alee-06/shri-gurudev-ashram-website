import SectionHeading from "../components/SectionHeading";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { validateEmail, validatePhone } from "../utils/helpers";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    emailOptIn: false,
    email: "",
    emailVerified: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showEmailInput, setShowEmailInput] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "emailOptIn") {
        setShowEmailInput(checked);
        setFormData((prev) => ({
          ...prev,
          emailOptIn: checked,
          email: checked ? prev.email : "",
          emailVerified: false,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));

      // Clear error for this field
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }

      // Simulate email verification when email is entered
      if (name === "email" && value && validateEmail(value)) {
        setTimeout(() => {
          setFormData((prev) => ({ ...prev, emailVerified: true }));
        }, 1000);
      } else if (name === "email" && value) {
        setFormData((prev) => ({ ...prev, emailVerified: false }));
      }
    }
  };

  const handleMobileChange = (e) => {
    const mobile = e.target.value.replace(/\D/g, "").slice(0, 10);
    setFormData((prev) => ({ ...prev, mobile }));
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Full Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    // Mobile Number validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile = "Please enter a valid 10-digit mobile number";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Email validation (only if opted in)
    if (showEmailInput && formData.email) {
      if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle signup (placeholder)
      console.log("Signup data:", formData);
      alert("Account creation functionality will be implemented with backend integration");
    }
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-6">
        <SectionHeading
          title="Create Account"
          subtitle="Sign up to get started"
          center={true}
        />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500"
                    : "border-amber-200 focus:ring-amber-500"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleMobileChange}
                placeholder="Enter 10-digit mobile number"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.mobile
                    ? "border-red-300 focus:ring-red-500"
                    : "border-amber-200 focus:ring-amber-500"
                }`}
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-amber-200 focus:ring-amber-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 pr-10 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:ring-red-500"
                      : "border-amber-200 focus:ring-amber-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Email Opt-in Checkbox */}
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="emailOptIn"
                  checked={formData.emailOptIn}
                  onChange={handleChange}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">
                  Add email ID for receipts & updates
                </span>
              </label>

              {/* Email Input (only if checkbox is checked) */}
              {showEmailInput && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                      errors.email
                        ? "border-red-300 focus:ring-red-500"
                        : "border-amber-200 focus:ring-amber-500"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                  )}
                  {formData.email && (
                    <div className="mt-2 flex items-center space-x-2">
                      {formData.emailVerified ? (
                        <span className="text-sm text-green-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Email verified
                        </span>
                      ) : (
                        <span className="text-sm text-amber-600 flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Email verification required
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Create Account
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Signup;

