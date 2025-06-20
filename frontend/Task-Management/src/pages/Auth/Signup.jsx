import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import uploadImage from '../../utils/uploadImage';
import { UserContext } from '../../context/UserProvider';

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();

  //Handle Signup Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let profileImageUrl = ''

    if (!fullName) {
      setError("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    setError("");

    //Signup API Call
    try {
      //Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        adminInviteToken,
        profileImageUrl
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data)

        //Redirect based on role
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        {/* Header Section with Poly Brite styling */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className='text-2xl font-bold text-gray-800'>Create Account</h3>
          </div>
          <p className='text-sm text-gray-600 leading-relaxed mb-6'>
            Join our platform today and start managing your tasks with ease
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Enhanced Profile Photo Selector */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <ProfilePhotoSelector 
                image={profilePic} 
                setImage={setProfilePic}
                className="polybrite-profile-selector"
              />
            </div>
          </div>

          {/* Enhanced Input Grid */}
          <div className='grid md:grid-cols-2 gap-5'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              className="polybrite-input"
            />

            <Input 
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Enter your email"
              type="email"
              className="polybrite-input"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 characters"
              type="password"
              className="polybrite-input"
            />

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 digit code (optional)"
              type="text"
              className="polybrite-input"
            />
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="px-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-600">Password Strength:</span>
                <div className="flex gap-1">
                  <div className={`w-2 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 rounded-full ${password.length >= 8 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 rounded-full ${password.length >= 8 && /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-1 rounded-full ${password.length >= 8 && /[^A-Za-z0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message with enhanced styling */}
          {error && (
            <div className='bg-red-50 border-l-4 border-red-400 p-3 rounded-r-md'>
              <p className='text-red-700 text-sm font-medium'>{error}</p>
            </div>
          )}

          {/* Enhanced Signup Button */}
          <button 
            type='submit' 
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm transition-all duration-300 transform ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </div>
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>

          {/* Enhanced Sign In Link */}
          <div className="text-center pt-4">
            <p className='text-sm text-gray-600'>
              Already have an account?
              <Link 
                className='font-semibold text-blue-600 hover:text-blue-700 ml-2 transition-colors duration-200 hover:underline' 
                to="/login"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </form>

        {/* Bottom Branding */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            <span>Powered by Poly Brite Technology</span>
            <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Signup;