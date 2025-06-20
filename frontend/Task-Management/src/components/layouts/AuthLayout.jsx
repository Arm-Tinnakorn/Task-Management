import React from 'react'
import UI_IMG from "../../assets/images/auth.jpg"

const AuthLayout = ({ children }) => {
  return (
    <div className='flex min-h-screen bg-gray-50'>
      {/* Left Side - Form Section */}
      <div className='w-screen h-screen md:w-[55vw] px-8 lg:px-16 pt-8 pb-12 bg-white relative overflow-y-auto'>
        {/* Enhanced Header with Poly Brite branding */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <img 
              src="/logo.png" 
              alt="Poly Brite Logo" 
              className='w-14 h-14 object-contain drop-shadow-sm' 
            /> 
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-80"></div>
          </div>
          <div>
            <h2 className='text-xl font-bold text-gray-800 leading-tight'>Task Management</h2>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">Poly Brite</span>
              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-10 w-32 h-32 bg-blue-50 rounded-full opacity-30"></div>
          <div className="absolute bottom-20 left-10 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-40"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Right Side - Image/Branding Section */}
      <div className='hidden md:flex w-[45vw] h-screen items-center justify-center relative overflow-hidden'
           style={{ 
             background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 50%, #1E40AF 100%)'
           }}>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          {/* Animated background shapes */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-4 h-4 bg-white bg-opacity-20 rounded-full"></div>
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-white bg-opacity-30 rounded-full"></div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col items-center text-center p-8 max-w-md">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg"></div>
              </div>
            </div>
            {/* <h3 className="text-2xl font-bold text-white mb-2">Poly Brite</h3> */}
            <p className="text-blue-100 text-sm">Task Management System</p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 text-left w-full">
            <div className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 bg-yellow-300 rounded-full flex-shrink-0"></div>
              <span className="text-sm">Efficient task organization</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 bg-yellow-300 rounded-full flex-shrink-0"></div>
              <span className="text-sm">Real-time collaboration</span>
            </div>
            <div className="flex items-center gap-3 text-white">
              <div className="w-2 h-2 bg-yellow-300 rounded-full flex-shrink-0"></div>
              <span className="text-sm">Advanced analytics</span>
            </div>
          </div>

          {/* Main illustration */}
          <div className="mt-8 relative">
            <img 
              src={UI_IMG} 
              className='w-48 lg:w-64 drop-shadow-2xl rounded-2xl border-4 border-white border-opacity-20' 
              alt="Task Management Interface"
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-400/20 to-transparent rounded-3xl blur-xl"></div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-800/30 to-transparent"></div>
      </div>
    </div>
  )
}

export default AuthLayout