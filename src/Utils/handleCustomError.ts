import { AxiosError } from "axios";
import { showErrorNotification } from "./notifications";
import { CustomError } from "@/Common/interface";
import { store } from "@/Redux/Store";

export const handleCustomError = (error: AxiosError | any): void => {
  if (error.isAxiosError) {
    const axiosError = error as AxiosError<CustomError>;
    axiosError.response?.data?.status || 500;
    axiosError.response?.data?.message || axiosError.message;
  } else if (error instanceof Error) {
    error.message;
  }

  // Handle 401 Unauthorized
  if (error?.response?.status === 401) {
    document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    localStorage.clear();
    Object.keys(localStorage).forEach((key: string) => {
      localStorage.removeItem(key);
    });
    sessionStorage.clear();
    store.dispatch({ type: "@@redux/INIT" });
    window.location.reload();
    return;
  }

  // Handle other errors
  showErrorNotification(
    error?.response?.data?.message
      ? error?.response?.data?.message
      : error?.response?.data
  );
};
