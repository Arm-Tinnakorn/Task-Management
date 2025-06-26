import React, { useContext, useEffect, useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'

import DashboardLayout from '../../components/layouts/DashboardLayout';
import { UserContext } from '../../context/UserProvider';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import moment from 'moment'
import InfoCard from '../../components/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/helper';
import { LuArrowRight } from 'react-icons/lu';
import TaskListTable from '../../components/TaskListTable';
import CustomPieChart from '../../components/Charts/CustomPieChart';
import CustomBarChart from '../../components/Charts/CustomBarChart';

// Poly Brite Color Scheme
const COLORS = ["#800080", "#1E90FF", "#008000"] // Blue, Red, Yellow

const Dashboard = () => {
  useUserAuth();
  const { user } = useContext(UserContext)
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  //Prepare Chart Data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    const taskPriorityLevelsRaw = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];
    setBarChartData(taskPriorityLevelsRaw);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.TASKS.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  useEffect(() => {
    getDashboardData()
    return () => { }
  }, [])

  const onSeeMore = () => {
    navigate('/admin/tasks')
  }

  return (
    <DashboardLayout activeMenu="Dashboard">
      {/* Welcome Card with Poly Brite styling */}
      <div className="my-4 md:my-6">
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-4 right-8 w-8 h-8 bg-yellow-400/30 rounded-full"></div>
            <div className="absolute bottom-2 right-16 w-4 h-4 bg-red-400/40 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Good Morning! 
                <span className="block text-yellow-300 mt-1">{user?.name}</span>
              </h2>
              <p className="text-blue-100 text-sm md:text-base">
                {moment().format("dddd, Do MMMM YYYY")}
              </p>
              
              {/* Mobile-friendly welcome message */}
              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm text-blue-50">
                  Welcome to your dashboard! Here's your task overview for today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards with improved mobile layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Tasks</p>
              <p className="text-3xl font-bold mt-2">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.All || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Pending Tasks</p>
              <p className="text-3xl font-bold mt-2">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Pending || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">In Progress</p>
              <p className="text-3xl font-bold mt-2">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.InProgress || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔄</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold mt-2">
                {addThousandsSeparator(dashboardData?.charts?.taskDistribution?.Completed || 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section with improved mobile layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Task Distribution Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-xl font-bold text-gray-800">Task Distribution</h5>
              <p className="text-sm text-gray-500 mt-1">Overview of task statuses</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <CustomPieChart data={pieChartData} colors={COLORS} />
          </div>
        </div>

        {/* Task Priority Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h5 className="text-xl font-bold text-gray-800">Task Priority Levels</h5>
              <p className="text-sm text-gray-500 mt-1">Breakdown by priority</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
          <div className="h-64 md:h-80">
            <CustomBarChart data={barChartData} />
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h5 className="text-xl font-bold text-gray-800">Recent Tasks</h5>
            <p className="text-sm text-gray-500 mt-1">Latest task activities</p>
          </div>
          
          {/* Mobile-friendly button */}
          <button 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            onClick={onSeeMore}
          >
            <span>View All Tasks</span>
            <LuArrowRight className="text-lg" />
          </button>
        </div>
        
        {/* Table wrapper with horizontal scroll for mobile */}
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full px-2 sm:px-0">
            <TaskListTable 
              tableData={dashboardData?.recentTasks || []} 
              role="admin" 
            />
          </div>
        </div>
      </div>

      {/* Mobile spacing */}
      <div className="h-6 md:h-8"></div>
    </DashboardLayout>
  )
}

export default Dashboard