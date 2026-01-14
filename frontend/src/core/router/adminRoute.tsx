import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@core/store/store";

export const AdminRoute = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const isAdmin = user?.role === "admin";

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};
