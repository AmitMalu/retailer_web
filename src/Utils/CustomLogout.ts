import { store } from "@/Redux/Store";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const useLogoutHandling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);

  const justLoggedIn = useRef<boolean>(false);
  const navigatingNormally = useRef<boolean>(false);

  const logout = (): void => {
    setIsLoading(true);
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    localStorage.clear();
    sessionStorage.clear();
    store.dispatch({ type: "@@redux/INIT" });
    setLogoutModal(false);
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" &&
      sessionStorage.getItem("justLoggedIn") === "true"
    ) {
      justLoggedIn.current = true;
      sessionStorage.removeItem("justLoggedIn");
    }

    navigatingNormally.current = true;
    setTimeout(() => {
      navigatingNormally.current = false;
    }, 500);
  }, [location.pathname]);

  const handlePopState = (): void => {
    if (navigatingNormally.current || justLoggedIn.current) return;

    const currentPath: string = window.location.pathname;
    const hasAuthToken: boolean = document.cookie.includes("authToken=");

    // Prevent logout popup during login and normal navigation
    if (
      currentPath === "/login" ||
      currentPath === "/register" ||
      currentPath === "/reset-password" ||
      !hasAuthToken
    ) {
      return;
    }

    // Only show popup if we have an active session and are navigating away
    const result: boolean = window.confirm("Are you sure you want to leave?");
    if (result) {
      logout();
    } else {
      window.history.forward();
    }
  };

  useEffect(() => {
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const manageLogoutHandler = (isInit: boolean): void => {
    if (isInit) {
      navigatingNormally.current = true;

      setTimeout(() => {
        navigatingNormally.current = false;
      }, 500);

      if (
        location.pathname === "/dashboard" &&
        sessionStorage.getItem("justLoggedIn") === "true"
      ) {
        justLoggedIn.current = true;
        sessionStorage.removeItem("justLoggedIn");
      }
    } else {
      logout();
    }
  };

  return {
    setLogoutModal,
    logoutModal,
    logout,
    isLoading,
    manageLogoutHandler,
  };
};
