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
    setNotifications(res.data.recentTasks); // หรือ filter เอาเฉพาะ completed
  }, 10000); // ทุก 10 วิ

  return () => clearInterval(interval); // ล้างตอน unmount
}, []);




    return (
        <>
            {/* Main Navbar */}
            <div className='flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-200/60 py-4 px-6 lg:px-8 sticky top-0 z-40 shadow-sm'>
                {/* Left Section */}
                <div className='flex items-center gap-4'>
                    {/* Mobile Menu Button */}
                    <button
                        className='lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95'
                        onClick={() => setOpenSideMenu(!openSideMenu)}
                    >
                        {openSideMenu ? (
                            <HiOutlineX className='text-xl text-gray-700' />
                        ) : (
                            <HiOutlineMenu className='text-xl text-gray-700' />
                        )}
                    </button>

                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src="/logo.png"
                                alt="Poly Brite Logo"
                                className='w-14 h-14 object-contain drop-shadow-sm cursor-pointer'
                                onClick={handleImageClick}
                            />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                        </div>
                        <div className="hidden sm:block">
                            <h2 className='text-lg font-bold text-gray-800 leading-tight'>Task Management</h2>
                            <div className="flex items-center gap-1">
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                <span className="text-xs text-blue-600 font-medium">Poly Brite</span>
                                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Section - Search (Desktop) */}
                {/* <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <input
                            type="text"
                            placeholder="Search tasks, projects..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                        />
                    </div>
                </div> */}

                {/* Right Section */}
                <div className='flex items-center gap-3'>
                    {/* Search Button (Mobile) */}
                    {/* <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <HiSearch className="text-xl text-gray-600" />
                    </button> */}

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={toggleNotification}
                            className="relative p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
                        >
                            <HiBell className="text-xl text-gray-600" />
                            {notifications.length > 0 && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotification && (
                            <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                                <div className="p-4 border-b font-semibold text-gray-700">Recent Tasks</div>
                                {notifications.length === 0 ? (
                                    <div className="p-4 text-sm text-gray-500">No new tasks</div>
                                ) : (
                                    notifications.map((task) => (
                                        <div key={task._id} 
                                        onClick={() => navigate(`/user/task-details/${task._id}`)}
                                        className="p-4 border-b hover:bg-gray-50 transition cursor-pointer">
                                            <div className="font-medium text-gray-800">{task.title}</div>
                                            <div className="text-xs text-gray-500">
                                                Created: {moment(task.createdAt).format('DD-MM-YYYY HH:mm')}
                                            </div>
                                            <div className="text-xs text-gray-400">Status: {task.status}</div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>




                    {/* User Profile */}
                    {user && (
                        <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                            <div className="hidden sm:block text-right">
                                <p className="text-sm font-medium text-gray-800 leading-tight">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {user?.role === "admin" ? "Administrator" : "User"}
                                </p>
                            </div>
                            <div className="relative" onClick={handleProfileClick}>
                                <img
                                    src={user?.profileImageUrl || "/default-avatar.png"}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover hover:border-blue-400 transition-all duration-200 cursor-pointer"
                                />

                                {user?.role === "admin" && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {openSideMenu && (
                <>
                    {/* Backdrop */}
                    <div
                        className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
                        onClick={() => setOpenSideMenu(false)}
                    ></div>

                    {/* Mobile Sidebar */}
                    <div className="lg:hidden fixed top-[73px] left-0 z-40 transform transition-transform duration-300 ease-in-out">
                        <div className="bg-white shadow-2xl rounded-r-2xl border-r border-gray-200">
                            <SideMenu activeMenu={activeMenu} onClose={() => setOpenSideMenu(false)} />
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Navbar