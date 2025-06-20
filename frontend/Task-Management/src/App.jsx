import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Signup from './pages/Auth/Signup';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Auth/Login'
import Dashboard from './pages/Admin/Dashboard';
import ManageTasks from './pages/Admin/ManageTasks';
import CreateTask from './pages/Admin/CreateTask';
import ManageUsers from './pages/Admin/ManageUsers';
import UserDashboard from './pages/User/UserDashboard';
import MyTask from './pages/User/MyTask';
import ViewTaskDetails from './pages/User/ViewTaskDetails';


import { Toaster } from 'react-hot-toast';
import UserInfoPage from './pages/UserInfoPage';
import UserProvider, { UserContext } from './context/UserProvider';

const App = () => {
  return (
    <UserProvider>

      <div>

        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/test" element={<Test />} />

            {/* For All Logged-in Users */}
            <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
              <Route path='/user/info' element={<UserInfoPage />} />
            </Route>


            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path='/admin/tasks' element={<ManageTasks />} />
              <Route path='/admin/create-task' element={<CreateTask />} />
              <Route path='/admin/users' element={<ManageUsers />} />
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={["user"]} />}>
              <Route path='/user/dashboard' element={<UserDashboard />} />
              <Route path='/user/tasks' element={<MyTask />} />
              <Route path='/user/task-details/:id' element={<ViewTaskDetails />} />
            </Route>

            {/* Default Route */}
            <Route path='/' element={<Root />} />

          </Routes>
        </Router>

      </div>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px", },
        }}
      />
    </UserProvider>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />

  if (!user) {
    return <Navigate to="/login" />;
  }

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />;

}