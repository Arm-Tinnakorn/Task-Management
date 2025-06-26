import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserProvider'
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA } from '../../utils/data';
import { useNavigate } from "react-router-dom";
import { HiLogout, HiChevronRight } from 'react-icons/hi';

const SideMenu = ({ activeMenu, onClose }) => {
    const { user, clearUser } = useContext(UserContext)
    const [sideMenuData, setSideMenuData] = useState([]);
    const navigate = useNavigate();

    const handleClick = (route, label) => {
        if (route === "Logout" || label === "Logout") {
            handleLogout();
            return;
        }
        navigate(route);
        // Close mobile menu if onClose prop is provided
        if (onClose) {
            onClose();
        }
    }

    const handleLogout = () => {
        localStorage.clear();
        clearUser();
        navigate("/login");
        if (onClose) {
            onClose();
        }
    };

    useEffect(() => {
        if (user) {
            setSideMenuData(user?.role === 'admin' ? SIDE_MENU_DATA : SIDE_MENU_USER_DATA)
        }
        return () => {};
    }, [user]);

    return (
        <div className='w-64 h-[calc(100vh-73px)] bg-white/95 backdrop-blur-md border-r border-gray-200/60 sticky top-[73px] z-20 overflow-y-auto overflow-x-hidden custom-scrollbar'>
            {/* User Profile Section */}
            <div className='flex flex-col items-center justify-center p-6 border-b border-gray-100'>
                <div className='relative mb-4'>
                    {/* Profile Image Container */}
                    <div className="relative">
                        <img 
                            onClick={() => navigate('/user/info')}
                            src={user?.profileImageUrl || "/default-avatar.png"} 
                            alt="Profile Image" 
                            className='w-20 h-20 rounded-full border-4 border-blue-100 shadow-md object-cover cursor-pointer'
                        />
                        {/* Online Status Indicator */}
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* Admin Badge */}
                    {user?.role === "admin" && (
                        <div className='absolute -top-2 -right-2 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 px-3 py-1 rounded-full shadow-md border-2 border-white'>
                            Admin
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="text-center">
                    <h5 className='text-gray-800 font-semibold text-lg leading-tight mb-1'>
                        {user?.name || "User"}
                    </h5>
                    <p className='text-sm text-gray-500 mb-2'>
                        {user?.email || "user@example.com"}
                    </p>
                    
                    {/* Role Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        user?.role === "admin" 
                            ? "bg-blue-100 text-blue-700" 
                            : "bg-gray-100 text-gray-600"
                    }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                            user?.role === "admin" ? "bg-blue-500" : "bg-gray-400"
                        }`}></div>
                        {user?.role === "admin" ? "Administrator" : "User List"}
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="py-4">
                <div className="px-4 mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Navigation</p>
                </div>
                
                {sideMenuData.map((item, index) => (
                    <button 
                        key={`menu_${index}`} 
                        className={`w-full flex items-center justify-between gap-3 text-sm font-medium transition-all duration-200 mx-2 mb-1 rounded-xl group ${
                            activeMenu === item.label
                                ? "text-blue-700 bg-gradient-to-r from-blue-50 to-blue-100 border-r-4 border-blue-500 shadow-sm" 
                                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        } py-3 px-4 cursor-pointer`}
                        onClick={() => handleClick(item.path, item.label)}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg transition-colors duration-200 ${
                                activeMenu === item.label
                                    ? "bg-blue-500 text-white" 
                                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                            }`}>
                                <item.icon className="text-lg" />
                            </div>
                            <span>{item.label}</span>
                        </div>
                        
                        {/* Arrow indicator for active menu */}
                        {activeMenu === item.label && (
                            <HiChevronRight className="text-blue-500 text-sm" />
                        )}
                    </button>
                ))}
            </div>

            {/* Logout Section */}
            <div className="relative bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white/95">
                <button 
                    className="w-full flex items-center gap-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 py-3 px-4 rounded-xl transition-all duration-200 group"
                    onClick={handleLogout}
                >
                    <div className="p-1.5 rounded-lg bg-red-100 text-red-500 group-hover:bg-red-200 transition-colors duration-200">
                        <HiLogout className="text-lg" />
                    </div>
                    <span>Logout</span>
                </button>
                
                {/* Footer Branding */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                        <span>Poly Brite v2.0</span>
                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideMenu