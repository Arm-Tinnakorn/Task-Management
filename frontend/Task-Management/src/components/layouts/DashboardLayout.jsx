import React, { useContext } from 'react'
import Navbar from './Navbar'
import SideMenu from './SideMenu'
import { UserContext } from '../../context/UserProvider'

const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext)
    
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50'>
            {/* Enhanced Navbar */}
            <Navbar activeMenu={activeMenu} />

            {user && (
                <div className='flex relative'> 
                    {/* Desktop Sidebar */}
                    <div className='max-[1080px]:hidden'>
                        <SideMenu activeMenu={activeMenu} />
                    </div>
                    
                    {/* Main Content Area */}
                    <div className='flex-1 relative'>
                        {/* Background decorative elements */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-20 right-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-200/20 rounded-full blur-2xl"></div>
                            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-300/10 rounded-full blur-xl"></div>
                        </div>
                        
                        {/* Content Container */}
                        <div className='relative  z-10 lg:p-8 '>
                            <div className='max-w-7xl mx-auto'>
                                {/* Content with enhanced styling */}
                                <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 p-5 lg:p-8 min-h-[calc(100vh-140px)]'>
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Loading state for non-authenticated users */}
            {!user && (
                <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DashboardLayout