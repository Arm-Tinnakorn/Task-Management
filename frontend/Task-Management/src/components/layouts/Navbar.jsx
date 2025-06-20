import React, { useState, useContext, useEffect } from 'react'
import SideMenu from './SideMenu';
import { HiOutlineMenu, HiOutlineX, HiBell, HiSearch } from 'react-icons/hi';
import { UserContext } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import moment from 'moment';

const Navbar = ({ activeMenu }) => {
    const [openSideMenu, setOpenSideMenu] = useState(false)
    const { user } = useContext(UserContext)
    const navigate = useNavigate();
    
    const handleProfileClick = () => {
        navigate('/user/info')
    }
    
    const handleImageClick = () => {
        if (user.role === 'admin') {
            navigate('/admin/dashboard')
        } else if (user.role === 'user') {
            navigate('/user/dashboard')
        }
    }

    const [notifications, setNotifications] = useState([]);
    const [showNotification, setShowNotification] = useState(false);

    const toggleNotification = () => {
        setShowNotification((prev) => !prev);
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axiosInstance.get('/api/tasks/user-dashboard-data')
                setNotifications(res.data.recentTasks)
            } catch (error) {
                console.error(error)
            }
        }
        fetchNotifications()
    }, [])

    useEffect(() => {
        const interval = setInterval(async () => {
            const res = await axiosInstance.get('/api/tasks/dashboard');
            setNotifications(res.data.recentTasks);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Main Navbar with Poly Brite Theme */}
            <div className='flex items-center justify-between bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 backdrop-blur-md border-b border-blue-400/30 py-3 px-4 lg:px-6 sticky top-0 z-40 shadow-lg shadow-blue-500/20'>
                {/* Left Section */}
                <div className='flex items-center gap-3'>
                    {/* Mobile Menu Button */}
                    <button
                        className='lg:hidden p-2.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all duration-200 active:scale-95 touch-manipulation'
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                    >
                        {openSideMenu ? (
                            <HiOutlineX className='text-xl text-white drop-shadow-sm' />
                        ) : (
                            <HiOutlineMenu className='text-xl text-white drop-shadow-sm' />
                        )}
                    </button>

                    {/* Logo and Brand - Poly Brite Style */}
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-white/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
                            <img
                                src="/logo.png"
                                alt="Poly Brite Logo"
                                className='relative w-12 h-12 lg:w-14 lg:h-14 object-contain drop-shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 touch-manipulation'
                                onClick={handleImageClick}
                            />
                            {/* Sparkle Effect */}
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-300 to-red-500 rounded-full shadow-lg animate-pulse"></div>
                        </div>
                        
                        <div className="hidden sm:block">
                            <h2 className='text-lg lg:text-xl font-bold text-white leading-tight drop-shadow-md'>
                                Task Management
                            </h2>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-sm animate-pulse"></div>
                                <span className="text-xs lg:text-sm text-yellow-100 font-semibold tracking-wide">
                                    POLY
                                </span>
                                <div className="w-2 h-2 bg-gradient-to-r from-yellow-300 to-red-500 rounded-full shadow-sm"></div>
                                <span className="text-xs lg:text-sm text-red-200 font-bold tracking-wide">
                                    BRITE
                                </span>
                                <div className="w-1.5 h-1.5 bg-yellow-300 rounded-full shadow-sm animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-2 lg:gap-3'>
                    {/* Notifications with Poly Brite Style */}
                    <div className="relative">
                        <button
                            onClick={toggleNotification}
                            className="relative p-2.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition-all duration-200 active:scale-95 touch-manipulation"
                        >
                            <HiBell className="text-xl text-white drop-shadow-sm" />
                            {notifications.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-white shadow-lg">
                                    <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-75"></div>
                                </div>
                            )}
                        </button>

                        {/* Enhanced Notification Dropdown */}
                        {showNotification && (
                            <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white shadow-2xl rounded-2xl border border-gray-100 z-50 max-h-96 overflow-hidden">
                                {/* Header with Poly Brite styling */}
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                                        <span className="font-bold text-gray-700">Recent Tasks</span>
                                        <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                    </div>
                                </div>
                                
                                <div className="overflow-y-auto max-h-80 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-gray-50">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <HiBell className="text-blue-500 text-lg" />
                                            </div>
                                            <p className="text-sm text-gray-500">No new tasks</p>
                                        </div>
                                    ) : (
                                        notifications.map((task, index) => (
                                            <div key={task._id}
                                                onClick={() => navigate(`/user/task-details/${task._id}`)}
                                                className="p-4 border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition-all cursor-pointer active:bg-blue-200 touch-manipulation">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-800 truncate text-sm lg:text-base">
                                                            {task.title}
                                                        </div>
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Created: {moment(task.createdAt).format('DD-MM-YYYY HH:mm')}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-gray-400">Status:</span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                                                task.status === 'completed' 
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : task.status === 'in-progress'
                                                                    ? 'bg-blue-100 text-blue-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Profile with Enhanced Styling */}
                    {user && (
                        <div className="flex items-center gap-2 lg:gap-3 pl-3 border-l border-white/30">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm lg:text-base font-bold text-white leading-tight drop-shadow-sm">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-blue-100 font-medium">
                                    {user?.role === "admin" ? "Administrator" : "User"}
                                </p>
                            </div>
                            
                            <div className="relative group" onClick={handleProfileClick}>
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-white/30 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                                
                                <img
                                    src={user?.profileImageUrl || "/default-avatar.png"}
                                    alt="Profile"
                                    className="relative w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white/50 object-cover hover:border-white hover:scale-105 transition-all duration-200 cursor-pointer shadow-lg touch-manipulation"
                                />

                                {/* Admin Badge with Poly Brite styling */}
                                {user?.role === "admin" && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-yellow-400 to-red-500 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                                        <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Overlay with Enhanced Backdrop */}
            {openSideMenu && (
                <>
                    {/* Enhanced Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-gradient-to-br from-black/30 via-blue-900/20 to-black/40 backdrop-blur-sm z-30 touch-manipulation"
                        onClick={() => setOpenSideMenu(false)}
                    ></div>

                    {/* Mobile Sidebar with Poly Brite styling */}
                    <div className="lg:hidden fixed top-[73px] left-0 z-40 transform transition-transform duration-300 ease-out">
                        <div className="bg-white shadow-2xl rounded-r-3xl border-r-4 border-gradient-to-b from-blue-500 to-red-500 overflow-hidden">
                            {/* Sidebar header with theme */}
                            <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-red-500"></div>
                            <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
                        </div>
                    </div>
                </>
            )}

            {/* Custom Styles for Scrollbar */}
            <style jsx>{`
                .scrollbar-thin {
                    scrollbar-width: thin;
                }
                .scrollbar-thumb-blue-200::-webkit-scrollbar-thumb {
                    background-color: #bfdbfe;
                    border-radius: 0.5rem;
                }
                .scrollbar-track-gray-50::-webkit-scrollbar-track {
                    background-color: #f9fafb;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
            `}</style>
        </>
    )
}

export default Navbar
