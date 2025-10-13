import { AxiosError } from "axios";
import { showErrorNotification } from "./notifications";
// import { CustomError } from "@/Common/interface";
import { store } from "@/Redux/Store";

// export const handleCustomError = (error: AxiosError | any): void => {
//   console.error("handleCustomError →", error);

//   if (error.isAxiosError) {
//     const axiosError = error as AxiosError<CustomError>;
//     axiosError.response?.data?.status || 500;
//     axiosError.response?.data?.message || axiosError.message;
//   } else if (error instanceof Error) {
//     error.message;
//   }

//   // Handle 401 Unauthorized
//   if (error?.response?.status === 401) {
//     document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
//     localStorage.clear();
//     Object.keys(localStorage).forEach((key: string) => {
//       localStorage.removeItem(key);
//     });
//     sessionStorage.clear();
//     store.dispatch({ type: "@@redux/INIT" });
//     window.location.reload();
//     return;
//   }

//   // 🔥 Safely extract message for all scenarios
//   const message =
//     error?.response?.data?.message || // API error message
//     (typeof error?.response?.data === "string" ? error.response.data : null) || // plain text response
//     error?.message || // Network or JS error
//     "Something went wrong. Please try again.";

//   showErrorNotification(message);
// };

export const handleCustomError = (error: AxiosError | any): void => {
  try {
    // Handle Axios errors
    if (error.isAxiosError) {
      const axiosError = error as AxiosError<any>;
      const responseData = axiosError.response?.data;

      // ✅ Handle 401 Unauthorized
      if (axiosError.response?.status === 401) {
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

      // ✅ Handle Profile Creation Validation Errors (messages array)
      if (
        Array.isArray(responseData?.messages) &&
        responseData.messages.length > 0
      ) {
        // showErrorNotification(responseData.messages[0]);
        showErrorNotification(responseData.messages.join("\n"));
        return;
      }

      // ✅ Handle single message string
      if (typeof responseData?.message === "string") {
        showErrorNotification(responseData.message);
        return;
      }

      // ✅ Handle error field
      if (typeof responseData?.error === "string") {
        showErrorNotification(responseData.error);
        return;
      }

      // ✅ Handle generic fallback
      showErrorNotification("An error occurred. Please try again later.");
      return;
    }

    // Handle non-Axios standard errors
    if (error instanceof Error && error.message) {
      showErrorNotification(error.message);
      return;
    }

    // Final fallback
    showErrorNotification("An unexpected error occurred.");
  } catch (e) {
    console.error("Error inside handleCustomError:", e);
    showErrorNotification("Something went wrong while handling error.");
  }
};
