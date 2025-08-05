import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSelectedRoute } from "@/Redux/Reducers/navigationReducer";

// Remove the base URL from the path
const normalizePath = (pathname: string): string => {
  const baseUrl = "/enterprises-portal";
  // Remove base URL if present
  if (pathname.startsWith(baseUrl)) {
    return pathname.slice(baseUrl.length) || "/";
  }
  return pathname;
};

export default function RouteChangeHandler() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const normalizedPath = normalizePath(location.pathname);
    dispatch(setSelectedRoute(normalizedPath));
  }, [location, dispatch]);

  return null;
}
