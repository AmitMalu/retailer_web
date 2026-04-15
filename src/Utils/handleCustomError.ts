import { AxiosError } from "axios";
import { showErrorNotification } from "./notifications";
// import { CustomError } from "@/Common/interface";
// import { persistor, store } from "@/Redux/Store";

export const handleCustomError = async (
  error: AxiosError | any,
): Promise<void> => {
  try {
    // Handle Axios errors
    if (error.isAxiosError) {
      const axiosError = error as AxiosError<any>;
      const response = axiosError?.response;
      const responseData = response?.data;

      // Timeout or Network Error (no response)
      if (axiosError.code === "ECONNABORTED") {
        showErrorNotification("Request timed out. Please try again.");
        return;
      }

      if (!response) {
        showErrorNotification(
          "Unable to connect to the server. Please try again later.",
        );
        return;
      }

      // Handle 401 Unauthorized
      if (response?.status === 401) {
        const { persistor, store } = await import("@/Redux/Store");
        try {
          // 1. Stop persisting
          persistor.pause();

          // 2. Flush pending writes
          await persistor.flush();

          // 3. Clear persisted storage
          await persistor.purge();

          // 4. Reset redux
          store.dispatch({ type: "RESET_APP" });

          // 5. Clear cookies
          document.cookie = `authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;

          // 6. Clear other storage
          localStorage.removeItem("chat");
          localStorage.clear();
          sessionStorage.clear();

          // 7. Redirect (DO NOT reload)
          // window.location.href = "/login";
          window.location.reload();

          return;
        } catch (err) {
          console.error("Logout failed", err);
        }
      }

      // Handle Profile Creation Validation Errors (messages array)
      if (
        Array.isArray(responseData?.messages) &&
        responseData.messages.length > 0
      ) {
        // showErrorNotification(responseData.messages[0]);
        showErrorNotification(responseData?.messages?.join("\n"));
        return;
      }

      // ✅ Handle single message string
      if (typeof responseData?.message === "string") {
        showErrorNotification(responseData?.message);
        return;
      }

      // ✅ Handle error field
      if (typeof responseData?.error === "string") {
        showErrorNotification(responseData?.error);
        return;
      }

      // ✅ Handle generic fallback
      showErrorNotification("An error occurred. Please try again later.");
      return;
    }

    // Handle non-Axios standard errors
    if (error instanceof Error) {
      showErrorNotification(error?.message);
      return;
    }

    // Final fallback
    showErrorNotification("An unexpected error occurred.");
  } catch (e) {
    console.log("10");
    console.error("Error inside handleCustomError:", e);
    showErrorNotification("Something went wrong while handling error.");
  }
};
