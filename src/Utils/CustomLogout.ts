import { persistor, store } from "@/Redux/Store";
import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import websocketService from "@/Services/websocketService";
import { clearNotifications } from "@/Redux/Reducers/notificationSlice";
import { clearLocation } from "@/Redux/Reducers/locationSlice";

export const useLogoutHandling = () => {
  console.log("useLogoutHandling hook initialized");
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logoutModal, setLogoutModal] = useState<boolean>(false);

  const justLoggedIn = useRef<boolean>(false);
  const navigatingNormally = useRef<boolean>(false);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Set flags to prevent navigation during logout
      sessionStorage.setItem("isLoggingOut", "true");
      sessionStorage.setItem("preventNavigation", "true");

      // Create overlay animation
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;

      const message = document.createElement('div');
      message.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      `;
      message.innerHTML = `
        <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #333;">
          Logging out...
        </div>
        <div style="font-size: 0.9rem; color: #666;">
          Please wait while we secure your session
        </div>
      `;

      overlay.appendChild(message);
      document.body.appendChild(overlay);

      // Add fade-in animation
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 0.3s ease-in-out';

      requestAnimationFrame(() => {
        overlay.style.opacity = '1';
      });

      // Wait for animation, then perform logout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 1. Stop persisting
      persistor.pause();

      // 2. Flush pending writes
      await persistor.flush();

      // 3. Clear persisted redux storage
      await persistor.purge();

      // 4. Clear notifications
      store.dispatch(clearNotifications());

      // 5. Clear location data
      store.dispatch(clearLocation());

      // 6. Reset redux state
      store.dispatch({ type: "RESET_APP" });

      // 7. Disconnect WebSocket
      websocketService.disconnect();

      // 8. Clear cookie
      document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;

      // Clear browser storage
      localStorage.removeItem("chat");
      localStorage.clear();
      sessionStorage.clear();

      setLogoutModal(false);

      // Wait a bit more for smooth transition
      await new Promise(resolve => setTimeout(resolve, 500));

      // Let browser handle navigation naturally with correct base path
      const basePath = import.meta.env.VITE_APP_BASE_PATH || "";
      window.location.href = `${basePath}/login`;
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsLoading(false);
      sessionStorage.removeItem("isLoggingOut");
      sessionStorage.removeItem("preventNavigation");
    }
  }, []);

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

  const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
    const currentPath: string = window.location.pathname;
    const hasAuthToken: boolean = document.cookie.includes("authToken=");

    // Only show reload warning for authenticated users on protected pages
    if (
      hasAuthToken &&
      currentPath !== "/login" &&
      currentPath !== "/register" &&
      currentPath !== "/reset-password"
    ) {
      sessionStorage.setItem("triggerLogoutOnReload", "true");
      event.preventDefault();
      event.returnValue = "";
    }
  };

  // Mark initial load as complete (separate from reload detection)
  useEffect(() => {
    const hasInitialLoad = sessionStorage.getItem('initialLoadComplete') === 'true';
    if (!hasInitialLoad) {
      sessionStorage.setItem('initialLoadComplete', 'true');
    }
  }, []);

  // Detect reload using performance.navigation
  // useEffect(() => {
  //   console.log("Checking for reload detection");

  //   // Check performance API
  //   const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  //   console.log("Navigation entries:", navEntries);

  //   if (navEntries.length > 0) {
  //     console.log("Navigation type:", navEntries[0].type);
  //   }

  //   // Check if this is a reload AND not the initial page load
  //   const isReload = navEntries.length > 0 && navEntries[0].type === "reload";
  //   const hasInitialLoad = sessionStorage.getItem('initialLoadComplete') === 'true';

  //   if (isReload && hasInitialLoad) {
  //     console.log("Reload detected via performance API");
  //     const currentPath: string = window.location.pathname;
  //     const hasAuthToken: boolean = document.cookie.includes("authToken=");

  //     // Only logout authenticated users on protected pages
  //     if (
  //       hasAuthToken &&
  //       currentPath !== "/login" &&
  //       currentPath !== "/register" &&
  //       currentPath !== "/reset-password"
  //     ) {
  //       console.log("Logging out due to reload");
  //       logout();
  //     }
  //   }

  //   // Also check for session storage flag as backup
  //   const isReloading = sessionStorage.getItem('isReloading');
  //   console.log("Session storage reload flag:", isReloading);

  //   if (isReloading === 'true') {
  //     console.log("Reload detected via session storage");
  //     sessionStorage.removeItem('isReloading');
  //     const currentPath: string = window.location.pathname;
  //     const hasAuthToken: boolean = document.cookie.includes("authToken=");

  //     if (
  //       hasAuthToken &&
  //       currentPath !== "/login" &&
  //       currentPath !== "/register" &&
  //       currentPath !== "/reset-password"
  //     ) {
  //       console.log("Logging out due to session storage reload");
  //       logout();
  //     }
  //   }
  // }, []);

  useEffect(() => {
    const shouldLogout = sessionStorage.getItem("triggerLogoutOnReload");

    if (shouldLogout === "true") {
      sessionStorage.removeItem("triggerLogoutOnReload");

      // Prevent logout immediately after login redirect
      const justLoggedInFlag = sessionStorage.getItem("justLoggedIn");

      if (justLoggedInFlag === "true") {
        sessionStorage.removeItem("justLoggedIn");
        return;
      }

      const currentPath = window.location.pathname;
      const hasAuthToken = document.cookie.includes("authToken=");

      if (
        hasAuthToken &&
        currentPath !== "/login" &&
        currentPath !== "/register" &&
        currentPath !== "/reset-password"
      ) {
        // Add a flag to prevent multiple logout calls
        const isLoggingOut = sessionStorage.getItem("isLoggingOut");
        if (!isLoggingOut) {
          sessionStorage.setItem("isLoggingOut", "true");
          // Also set a flag to prevent React Router navigation
          sessionStorage.setItem("preventNavigation", "true");

          // Show smooth logout animation
          const performSmoothLogout = async () => {
            try {
              // Create overlay animation
              const overlay = document.createElement('div');
              overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              `;

              const message = document.createElement('div');
              message.style.cssText = `
                background: white;
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              `;
              message.innerHTML = `
                <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 1rem; color: #333;">
                  Logging out...
                </div>
                <div style="font-size: 0.9rem; color: #666;">
                  Please wait while we secure your session
                </div>
              `;

              overlay.appendChild(message);
              document.body.appendChild(overlay);

              // Add fade-in animation
              overlay.style.opacity = '0';
              overlay.style.transition = 'opacity 0.3s ease-in-out';

              requestAnimationFrame(() => {
                overlay.style.opacity = '1';
              });

              // Wait for animation, then perform logout
              await new Promise(resolve => setTimeout(resolve, 1000));

              // 1. Stop persisting
              persistor.pause();
              // 2. Flush pending writes
              await persistor.flush();
              // 3. Clear persisted redux storage
              await persistor.purge();
              // 4. Clear notifications
              store.dispatch(clearNotifications());
              // 5. Clear location data
              store.dispatch(clearLocation());
              // 6. Reset redux state
              store.dispatch({ type: "RESET_APP" });
              // 7. Disconnect WebSocket
              websocketService.disconnect();
              // 8. Clear cookie
              document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
              // 9. Clear browser storage
              localStorage.removeItem("chat");
              localStorage.clear();
              sessionStorage.clear();

              // Wait a bit more for smooth transition
              await new Promise(resolve => setTimeout(resolve, 500));

              // Let browser handle reload naturally with correct base path
              const basePath = import.meta.env.VITE_APP_BASE_PATH || "";
              window.location.href = `${basePath}/login`;
            } catch (err) {
              console.error("Logout failed", err);
            } finally {
              sessionStorage.removeItem("isLoggingOut");
              sessionStorage.removeItem("preventNavigation");
            }
          };

          performSmoothLogout();
        }
      }
    }
  }, []);

  // Prevent browser hard reload and show logout prompt
  useEffect(() => {
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
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
