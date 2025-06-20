import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserProvider";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    // รอโหลดข้อมูล user ให้เสร็จ
    return <div>Loading...</div>; // หรือ spinner สวย ๆ
  }

  if (!user) {
    // ยังไม่ login ให้ไปหน้า login
    return <Navigate to="/login" replace />;
  }


  if (!allowedRoles.includes(user.role)) {
    // ไม่มีสิทธิ์ (role ไม่ตรงกับ allowedRoles)
    return <Navigate to="/unauthorized" replace />;
  }

  // ผ่านทุกเงื่อนไข ให้แสดงหน้า child route
  return <Outlet />;
};

export default PrivateRoute;
