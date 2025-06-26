import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom';
import { LuFileSpreadsheet, LuSparkles, LuDownload, LuBookCheck } from 'react-icons/lu';
import { HiOutlineDocumentReport, HiOutlineFilter } from 'react-icons/hi';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import TaskStatusTabs from '../../components/TaskStatusTabs';
import TaskCard from '../../components/Cards/TaskCard';

const MyTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All")
  const [isLoading, setIsLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const navigate = useNavigate();

  const getAllTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      })
      setAllTasks(response.data?.tasks?.length > 0 ? response.data.tasks : [])

      //Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || {}

      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks || 0},
        { label: "In Progress", count: statusSummary.inProgressTasks || 0},
        { label: "Completed", count: statusSummary.completedTasks || 0},
      ];

      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleClick = (taskId) => {
    navigate(`/user/task-details/${taskId}`)
  }



  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="p-4 lg:p-6">
        {/* Header Section with Poly Brite Styling */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl blur-lg opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-red-500 p-3 rounded-2xl shadow-lg">
                  <LuBookCheck className="text-white text-2xl" />
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  My Tasks
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 font-medium">Task Management System</span>
                  <LuSparkles className="text-yellow-500 text-sm" />
                </div>
              </div>


            </div>

            {/* Desktop Controls */}
            {tabs?.[0]?.count > 0 && (
              <div className="flex items-center gap-4">
                <TaskStatusTabs
                  tabs={tabs}
                  activeTab={filterStatus}
                  setActiveTab={setFilterStatus}
                />


              </div>
            )}
          </div>

          {/* Stats Bar */}
          {tabs.length > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl border border-blue-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {tabs.map((tab, index) => (
                  <div key={tab.label} className="text-center">
                    <div className={`text-2xl font-bold ${
                      index === 0 ? 'text-gray-700' :
                      index === 1 ? 'text-yellow-600' :
                      index === 2 ? 'text-blue-600' :
                      'text-green-600'
                    }`}>
                      {tab.count}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">{tab.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-red-500 rounded-full animate-spin" style={{ animationDelay: '0.1s' }}></div>
              </div>
              <p className="text-gray-600 font-medium">Loading tasks...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && allTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 rounded-full blur-xl opacity-20"></div>
              <div className="relative bg-gradient-to-r from-blue-100 to-red-100 p-8 rounded-full">
                <LuBookCheck className="text-6xl text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500 text-center max-w-md">
              {filterStatus === "All" 
                ? "You don't have any tasks yet. Create your first task to get started!"
                : `No tasks found with status "${filterStatus}". Try changing the filter or create a new task.`
              }
            </p>

          </div>
        )}

        {/* Tasks Grid */}
        {!isLoading && allTasks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allTasks.map((item, index) => (
              <div 
                key={item._id}
                className="transform transition-all duration-300 hover:scale-105"
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <TaskCard
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo?.map((item) => item.profileImageUrl)}
                  attachmentCount={item.attachment?.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item._id)}
                />
              </div>
            ))}
          </div>
        )}


      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        /* Custom scrollbar for mobile */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #ef4444);
          border-radius: 3px;
        }
      `}</style>
    </DashboardLayout>
  )
}

export default MyTasks
