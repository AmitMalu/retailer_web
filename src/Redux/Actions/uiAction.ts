import { createAction } from "@reduxjs/toolkit";

export const toggleDarkMode = createAction("ui/toggleDarkMode");

// Add more UI-related actions as needed
export const setLoading = createAction<boolean>("ui/setLoading");
export const setError = createAction<string | null>("ui/setError");
export const setSuccess = createAction<string | null>("ui/setSuccess");
export const setSidebarOpen = createAction<boolean>("ui/setSidebarOpen");
