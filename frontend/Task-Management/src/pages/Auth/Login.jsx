import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import Input from "../../components/Inputs/Input"
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { UserContext } from '../../context/UserProvider'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate();

  //Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault(); 
    setIsLoading(true);

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter the password");
      setIsLoading(false);
      return;
    }

    setError("");

    //Login API call
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
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
      <div className='lg:w-[85%] h-3/4 md:h-full flex flex-col justify-center'>
        {/* Header Section with Poly Brite styling */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className='text-2xl font-bold text-gray-800'>Welcome Back</h3>
          </div>
          <p className='text-sm text-gray-600 leading-relaxed'>
            Sign in to continue to your dashboard and manage your tasks efficiently
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Enhanced Input Fields */}
          <div className="space-y-5">
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              className="polybrite-input"
            />

            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Enter your password"
              type="password"
              className="polybrite-input"
            />
          </div>

          {/* Error Message with enhanced styling */}
          {error && (
            <div className='bg-red-50 border-l-4 border-red-400 p-3 rounded-r-md'>
              <p className='text-red-700 text-sm font-medium'>{error}</p>
            </div>
          )}

          {/* Enhanced Login Button */}
          <button 
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white text-sm transition-all duration-300 transform ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
            }`}
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              'SIGN IN'
            )}
          </button>

          {/* Enhanced Sign Up Link */}
          <div className="text-center pt-4">
            <p className='text-sm text-gray-600'>
              Don't have an account?
              <Link 
                className='font-semibold text-blue-600 hover:text-blue-700 ml-2 transition-colors duration-200 hover:underline' 
                to="/signup"
              >
                Create Account
              </Link>
            </p>
          </div>

          {/* Additional Features */}
          <div className="pt-4 border-t border-gray-100">
            <Link 
              to="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        {/* Bottom Branding */}
        <div className="mt-8 pt-6 border-t border-gray-100">
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

export default Login