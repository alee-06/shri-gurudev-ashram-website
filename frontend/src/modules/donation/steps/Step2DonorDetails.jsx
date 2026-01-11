import { useState } from 'react';
import FormInput from '../../../components/FormInput';
import PrimaryButton from '../../../components/PrimaryButton';
import { validateEmail, validatePhone } from '../../../utils/helpers';

const Step2DonorDetails = ({ data, updateData, nextStep, prevStep }) => {
  const [errors, setErrors] = useState({});
  const [showEmailInput, setShowEmailInput] = useState(data.emailOptIn);
  const [editingGovtId, setEditingGovtId] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'emailOptIn') {
        setShowEmailInput(checked);
        updateData({ emailOptIn: checked, email: checked ? data.email : '', emailVerified: false });
      } else if (name === 'anonymousDisplay') {
        updateData({ anonymousDisplay: checked });
      }
    } else {
      updateData({ [name]: value });
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
      
      // Simulate email verification when email is entered
      if (name === 'email' && value && validateEmail(value)) {
        // Simulate verification delay
        setTimeout(() => {
          updateData({ emailVerified: true });
        }, 1000);
      } else if (name === 'email' && value) {
        updateData({ emailVerified: false });
      }
    }
  };

  const handleGovtIdTypeChange = (type) => {
    updateData({ govtIdType: type });
    setEditingGovtId(true);
    if (errors.govtId) {
      setErrors(prev => ({ ...prev, govtId: '' }));
    }
  };

  const validatePAN = (pan) => {
    // PAN format: AAAAA9999A (5 letters, 4 digits, 1 letter)
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panPattern.test(pan);
  };

  const handleGovtIdChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'aadhaar') {
      formattedValue = value.replace(/\D/g, '').slice(0, 12);
    } else if (name === 'pan') {
      formattedValue = value.replace(/[^A-Z0-9]/gi, '').slice(0, 10).toUpperCase();
    }
    
    updateData({ [name]: formattedValue });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDOBChange = (e) => {
    updateData({ dateOfBirth: e.target.value });
    if (errors.dateOfBirth) {
      setErrors(prev => ({ ...prev, dateOfBirth: '' }));
    }
  };

  const maskGovtId = (value, type) => {
    if (!value) return '';
    if (editingGovtId) return value;
    if (type === 'aadhaar' && value.length > 4) {
      // Format: **** **** 1234
      return '**** **** ' + value.slice(-4);
    } else if (type === 'pan' && value.length > 4) {
      return '****' + value.slice(-4);
    }
    return value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Full Name (required)
    if (!data.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    // Mobile Number (required, 10 digits)
    if (!data.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!validatePhone(data.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Email (optional, but validate if provided)
    if (showEmailInput && data.email) {
      if (!validateEmail(data.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Address (required)
    if (!data.address.trim()) {
      newErrors.address = 'Address is required';
    }

    // Government ID (mandatory - any one)
    if (!data.govtIdType) {
      newErrors.govtId = 'Please select a government ID type';
    } else {
      if (data.govtIdType === 'aadhaar') {
        if (!data.aadhaar || data.aadhaar.length !== 12) {
          newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
        }
      } else if (data.govtIdType === 'pan') {
        if (!data.pan || data.pan.length !== 10) {
          newErrors.pan = 'Please enter a valid 10-character PAN number';
        } else if (!validatePAN(data.pan)) {
          newErrors.pan = 'PAN must be in format: AAAAA9999A (5 letters, 4 digits, 1 letter)';
        }
      }
    }

    // DOB is mandatory for all
    if (!data.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      nextStep();
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">
        Donor Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name (required) */}
        <FormInput
          label="Full Name"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          error={errors.name}
        />

        {/* Mobile Number (required, 10 digits) */}
        <FormInput
          label="Mobile Number"
          type="tel"
          name="mobile"
          value={data.mobile}
          onChange={(e) => {
            const mobile = e.target.value.replace(/\D/g, '').slice(0, 10);
            updateData({ mobile });
            if (errors.mobile) {
              setErrors(prev => ({ ...prev, mobile: '' }));
            }
          }}
          placeholder="Enter your 10-digit mobile number"
          required
          error={errors.mobile}
        />

        {/* Email (Optional - Opt-in only) */}
        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              name="emailOptIn"
              checked={data.emailOptIn}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Add email ID to receive receipt & updates
            </span>
          </label>
          
          {showEmailInput && (
            <div>
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                placeholder="Enter your email"
                error={errors.email}
              />
              {data.email && (
                <div className="mt-2 flex items-center space-x-2">
                  {data.emailVerified ? (
                    <span className="text-sm text-green-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Email verified
                    </span>
                  ) : (
                    <span className="text-sm text-amber-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      Email verification required
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Address (required) */}
        <FormInput
          label="Address"
          name="address"
          value={data.address}
          onChange={handleChange}
          placeholder="Enter your complete address"
          required
          error={errors.address}
        />

        {/* Government ID (Mandatory - Any One) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Government ID <span className="text-red-500">*</span>
          </label>
          
          {/* Radio selection for ID type */}
          <div className="flex space-x-4 mb-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="govtIdType"
                value="aadhaar"
                checked={data.govtIdType === 'aadhaar'}
                onChange={(e) => handleGovtIdTypeChange('aadhaar')}
                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">Aadhaar</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="govtIdType"
                value="pan"
                checked={data.govtIdType === 'pan'}
                onChange={(e) => handleGovtIdTypeChange('pan')}
                className="w-4 h-4 text-amber-600 border-gray-300 focus:ring-amber-500"
              />
              <span className="text-sm text-gray-700">PAN</span>
            </label>
          </div>

          {/* Show selected ID input */}
          {data.govtIdType === 'aadhaar' && (
            <div>
              <FormInput
                label="Aadhaar Number"
                type="text"
                name="aadhaar"
                value={maskGovtId(data.aadhaar, 'aadhaar')}
                onChange={handleGovtIdChange}
                onFocus={() => setEditingGovtId(true)}
                onBlur={() => {
                  setTimeout(() => setEditingGovtId(false), 200);
                }}
                placeholder="Enter 12-digit Aadhaar number"
                required
                error={errors.aadhaar}
                maxLength={16}
              />
              {data.aadhaar && !editingGovtId && (
                <button
                  type="button"
                  onClick={() => setEditingGovtId(true)}
                  className="text-xs text-amber-600 hover:text-amber-700 mt-1"
                >
                  Edit
                </button>
              )}
            </div>
          )}

          {data.govtIdType === 'pan' && (
            <div className="space-y-3">
              <div>
                <FormInput
                  label="PAN Number"
                  type="text"
                  name="pan"
                  value={maskGovtId(data.pan, 'pan')}
                  onChange={handleGovtIdChange}
                  onFocus={() => setEditingGovtId(true)}
                  onBlur={() => {
                    setTimeout(() => setEditingGovtId(false), 200);
                  }}
                  placeholder="Enter 10-character PAN number (e.g., ABCDE1234F)"
                  required
                  error={errors.pan}
                  maxLength={14}
                />
                {data.pan && !editingGovtId && (
                  <button
                    type="button"
                    onClick={() => setEditingGovtId(true)}
                    className="text-xs text-amber-600 hover:text-amber-700 mt-1"
                  >
                    Edit
                  </button>
                )}
              </div>

              {/* Helper Text for PAN */}
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-700">
                  Required for statutory donation records. Your information is kept confidential.
                </p>
              </div>
            </div>
          )}

          {errors.govtId && (
            <p className="mt-1 text-sm text-red-600">{errors.govtId}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={data.dateOfBirth}
            onChange={handleDOBChange}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.dateOfBirth
                ? 'border-red-300 focus:ring-red-500'
                : 'border-gray-300 focus:ring-amber-500'
            }`}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Anonymous Display (Display Only) */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="anonymousDisplay"
              checked={data.anonymousDisplay}
              onChange={handleChange}
              className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
            />
            <span className="text-sm text-gray-700">
              Display my name as Anonymous publicly
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            This only affects public donation lists. All details are still collected internally.
          </p>
        </div>

        <div className="flex gap-4 pt-4">
          <PrimaryButton
            type="button"
            onClick={prevStep}
            variant="outline"
            className="flex-1"
          >
            Back
          </PrimaryButton>
          <PrimaryButton type="submit" className="flex-1">
            Continue
          </PrimaryButton>
        </div>
      </form>
    </div>
  );
};

export default Step2DonorDetails;
