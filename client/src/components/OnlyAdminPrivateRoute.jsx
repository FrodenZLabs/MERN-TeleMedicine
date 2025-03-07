import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.authentication);

  return currentUser && currentUser.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
}

export default OnlyAdminPrivateRoute;
