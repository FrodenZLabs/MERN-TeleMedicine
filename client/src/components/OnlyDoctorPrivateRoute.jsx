// import React from 'react'
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function OnlyDoctorPrivateRoute() {
  const { currentUser } = useSelector((state) => state.authentication);

  return currentUser && currentUser.role === "doctor" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default OnlyDoctorPrivateRoute;
