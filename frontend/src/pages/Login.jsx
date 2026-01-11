import SectionHeading from "../components/SectionHeading";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const COUNTRY_OPTIONS = [
  { value: "IN", label: "India", dialCode: "+91", length: 10 },
  { value: "US", label: "United States", dialCode: "+1", length: 10 },
  { value: "CA", label: "Canada", dialCode: "+1", length: 10 },
  { value: "GB", label: "United Kingdom", dialCode: "+44", length: 10 },
  { value: "AU", label: "Australia", dialCode: "+61", length: 9 },
  { value: "JP", label: "Japan", dialCode: "+81", length: 10 },
  { value: "AF", label: "Afghanistan", dialCode: "+93", length: 9 },
  { value: "AL", label: "Albania", dialCode: "+355", length: 9 },
  { value: "DZ", label: "Algeria", dialCode: "+213", length: 9 },
  { value: "AE", label: "United Arab Emirates", dialCode: "+971", length: 9 },
  { value: "AR", label: "Argentina", dialCode: "+54", length: 10 },
  { value: "AT", label: "Austria", dialCode: "+43", length: 10 },
  { value: "BR", label: "Brazil", dialCode: "+55", length: 11 },
  { value: "CN", label: "China", dialCode: "+86", length: 11 },
  { value: "DE", label: "Germany", dialCode: "+49", length: 11 },
  { value: "FR", label: "France", dialCode: "+33", length: 9 },
  { value: "IT", label: "Italy", dialCode: "+39", length: 10 },
  { value: "MX", label: "Mexico", dialCode: "+52", length: 10 },
  { value: "NL", label: "Netherlands", dialCode: "+31", length: 9 },
  { value: "RU", label: "Russia", dialCode: "+7", length: 10 },
  { value: "SG", label: "Singapore", dialCode: "+65", length: 8 },
  { value: "ZA", label: "South Africa", dialCode: "+27", length: 9 },
  { value: "KR", label: "South Korea", dialCode: "+82", length: 10 },
  { value: "ES", label: "Spain", dialCode: "+34", length: 9 },
  { value: "CH", label: "Switzerland", dialCode: "+41", length: 9 },
];

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("phone"); // "phone" or "email"
  const [showPassword, setShowPassword] = useState(false);
  const [country, setCountry] = useState(COUNTRY_OPTIONS[0]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleCountryChange = (event) => {
    const selected = COUNTRY_OPTIONS.find((opt) => opt.value === event.target.value);
    if (selected) {
      setCountry(selected);
      setPhone("");
    }
  };

  const handlePhoneChange = (event) => {
    const digitsOnly = event.target.value.replace(/\D/g, "");
    setPhone(digitsOnly.slice(0, country.length));
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg shadow-sm p-6">
        <SectionHeading
          title="Login"
          subtitle="Sign in to your account"
          center={true}
        />

        {/* Login Method Toggle */}
        <div className="mt-6 mb-4">
          <div className="flex bg-white rounded-lg p-1 border border-amber-200">
            <button
              type="button"
              onClick={() => setLoginMethod("phone")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === "phone"
                  ? "bg-amber-600 text-white"
                  : "text-gray-700 hover:text-amber-600"
              }`}
            >
              Phone Number
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("email")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                loginMethod === "email"
                  ? "bg-amber-600 text-white"
                  : "text-gray-700 hover:text-amber-600"
              }`}
            >
              Email ID
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-3">
            {/* Phone Login Mode */}
            {loginMethod === "phone" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={country.value}
                    onChange={handleCountryChange}
                    className="w-32 px-2 py-2 border border-amber-200 rounded-md bg-white text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 8px center',
                      paddingRight: '26px',
                    }}
                  >
                    {COUNTRY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label} ({opt.dialCode})
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder={`${country.length}-digit`}
                    className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Email Login Mode */}
            {loginMethod === "email" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Email ID
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Password Field (Common for both modes) */}
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
            className="w-full py-3 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition-colors"
          >
            Login
          </button>

          {/* Common Links */}
          <div className="space-y-2 text-center">
            <a
              href="#"
              className="block text-sm text-amber-600 hover:text-amber-700"
            >
              Forgot Password?
            </a>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-amber-600 hover:text-amber-700 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
