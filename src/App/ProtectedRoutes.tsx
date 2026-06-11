import { useLocation, useNavigate } from "react-router-dom";
import { ProtectedRouteProps, UserRole } from "@/Common/interface";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/Store";
import {
  decryptData,
  MENU_PATH_TO_ROLE_PATTERN,
  subRouteMapping,
} from "@/Utils/helper";
import { useEffect } from "react";
import Loader from "@/components/Atoms/Loader";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const apiResponses = useSelector(
    (state: RootState) => state.apiResponse.responses
  );

  // Loading guard
  const isLoading = !apiResponses;

  // Safe decrypt
  let loginData = null;
  try {
    loginData = apiResponses?.loginData
      ? decryptData(apiResponses.loginData)
      : null;
  } catch (e) {
    console.error("Decrypt failed:", e);
    loginData = null;
  }

  const userRole = loginData?.role as UserRole;
  const pathname = location.pathname;

  // Single navigation handler (IMPORTANT)
  useEffect(() => {
    if (isLoading) return;

    // Auth check
    if (requireAuth && !loginData) {
      navigate("/login", { replace: true, state: { from: location } });
      return;
    }

    // Allowed roles check
    if (allowedRoles.length && userRole && !allowedRoles.includes(userRole)) {
      navigate("/dashboard", { replace: true });
      return;
    }

    // RU validation
    if (userRole === "RU") {
      if (!loginData?.role_id || !loginData?.sub_role_id) {
        navigate("/dashboard", { replace: true });
        return;
      }

      const path = pathname;
      const menuPath = `/${path.split("/")[1]}`;

      if (menuPath in MENU_PATH_TO_ROLE_PATTERN) {
        const roleIndex = MENU_PATH_TO_ROLE_PATTERN[menuPath];

        if (
          !loginData.role_id ||
          roleIndex >= loginData.role_id.length ||
          loginData.role_id[roleIndex] !== "1"
        ) {
          navigate("/dashboard", { replace: true });
          return;
        }

        const subPath = path.split("/").slice(2).join("/");

        if (subPath && menuPath in subRouteMapping) {
          const subRoutes = subRouteMapping[menuPath];

          const routeIndex = subRoutes.findIndex((route) =>
            subPath.startsWith(route)
          );

          if (routeIndex !== -1) {
            const subRole = `${roleIndex + 1}.${routeIndex + 1}`;

            const subRoles = loginData.sub_role_id
              ?.split(",")
              ?.map((s: string) => s.trim())
              ?.filter((s: string) => s !== "0" && s !== "");

            if (!subRoles?.includes(subRole)) {
              navigate("/dashboard", { replace: true });
              return;
            }
          }
        }
      }
    }
  }, [
    isLoading,
    loginData,
    userRole,
    pathname,
    allowedRoles,
    requireAuth,
    navigate,
    location,
  ]);

  // UI guards (no crash rendering)
  if (isLoading) {
    return <Loader />;
  }

  if (requireAuth && !loginData) {
    return null;
  }

  if (allowedRoles.length && userRole && !allowedRoles.includes(userRole)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;