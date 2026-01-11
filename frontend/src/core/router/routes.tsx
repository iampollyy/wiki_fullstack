import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RoutesConfig } from "./router";
import { ProtectedRoute } from "./protectedRoute";
import { RootState } from "@core/store/store";

export const AppRoutes = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const location = useLocation();

  return (
    <Routes>
      {RoutesConfig.map(({ path, element, isPrivate }) => {
        if (isPrivate) {
          return (
            <Route key={path} element={<ProtectedRoute />}>
              <Route path={path} element={element} />
            </Route>
          );
        }
        if (path === "/login" || path === "/signup") {
          return (
            <Route
              key={path}
              path={path}
              element={
                token ? (
                  <Navigate
                    to={location.state?.from?.pathname || "/"}
                    replace
                  />
                ) : (
                  element
                )
              }
            />
          );
        }

        return <Route key={path} path={path} element={element} />;
      })}
    </Routes>
  );
};
