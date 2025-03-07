// import React from 'react'
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function OnlyPatientPrivateRoute() {
  const { currentUser } = useSelector((state) => state.authentication);

  return currentUser && currentUser.role === "patient" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default OnlyPatientPrivateRoute;
