import { persistor, store } from "@/Redux/Store";
import { useState, useRef, useEffect } from "react";
import {  useLocation } from "react-router-dom";
import websocketService from "@/Services/websocketService";
import { clearNotifications } from "@/Redux/Reducers/notificationSlice";

export const useLogoutHandling = () => {
  // const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);

  const justLoggedIn = useRef<boolean>(false);
  const navigatingNormally = useRef<boolean>(false);

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // 1. Stop persisting
      persistor.pause();

      // 2. Flush pending writes
      await persistor.flush();

      // 3. Clear persisted redux storage
      await persistor.purge();

      // 4. Clear notifications
      store.dispatch(clearNotifications());

      // 5. Reset redux state
      store.dispatch({ type: "RESET_APP" });

      // 6. Disconnect WebSocket
      websocketService.disconnect();

      // 7. Clear cookie
      document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;

      // Clear browser storage
      localStorage.removeItem("chat");
      localStorage.clear();
      sessionStorage.clear();

      setLogoutModal(false);

      // navigate("/login", { replace: true });
      window.location.reload();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoading(false);
    }
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

  const handlePopState = async (): Promise<void> => {
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
      await logout();
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

  const manageLogoutHandler = async (isInit: boolean): Promise<void> => {
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
      await logout();
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
