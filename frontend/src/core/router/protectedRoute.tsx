import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@core/store/store";

export const ProtectedRoute = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  const isAuth = !!token;

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

