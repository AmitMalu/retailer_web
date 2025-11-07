import { Navigate, useLocation } from "react-router-dom";
import { ProtectedRouteProps, UserRole } from "@/Common/interface";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  decryptData,
  MENU_PATH_TO_ROLE_PATTERN,
  subRouteMapping,
} from "@/Utils/helper";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );
  const loginData = apiResponses?.loginData
    ? decryptData(apiResponses.loginData)
    : null;

  const userRole = loginData?.role as UserRole;

  if (requireAuth && !loginData) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length === 0) {
    return <>{children}</>;
  }

  if (userRole === "RU") {
    if (!loginData?.role_id || !loginData?.sub_role_id) {
      return <Navigate to="/dashboard" replace state={{ from: location }} />;
    }

    const path = location.pathname;
    const menuPath = `/${path.split("/")[1]}`;
    if (menuPath in MENU_PATH_TO_ROLE_PATTERN) {
      const roleIndex = MENU_PATH_TO_ROLE_PATTERN[menuPath];

      if (
        roleIndex >= loginData.role_id.length ||
        loginData.role_id[roleIndex] !== "1"
      ) {
        return <Navigate to="/dashboard" replace state={{ from: location }} />;
      }

      const subPath = path.split("/").slice(2).join("/");
      if (subPath && menuPath in subRouteMapping) {
        const subRoutes = subRouteMapping[menuPath];
        const routeIndex = subRoutes.findIndex((route) =>
          subPath.startsWith(route)
        );

        if (routeIndex !== -1) {
          const subRole = `${MENU_PATH_TO_ROLE_PATTERN[menuPath] + 1}.${routeIndex + 1}`;
          const subRoles = loginData.sub_role_id
            .split(",")
            .map((s: string) => s.trim())
            .filter((s: string) => s !== "0" && s !== "");

          if (!subRoles.includes(subRole)) {
            return (
              <Navigate to="/dashboard" replace state={{ from: location }} />
            );
          }
        }
      }

      return <>{children}</>;
    }

    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
