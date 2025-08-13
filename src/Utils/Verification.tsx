import {
  Adhaar_Pan_Link,
  Adhaar_Verification,
  Email_Verification,
  Pan_Verification,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "./notifications";
import { handleCustomError } from "./handleCustomError";

export const useAadhaarVerification = () => {
  const verify = async (aadhaarNumber: string) => {
    try {
      const response = await Adhaar_Verification(Number(aadhaarNumber));
      const success = [200, 201].includes(response?.data?.data?.status_code);
      if (success) {
        showSuccessNotification("Aadhaar verified successfully");
        return true;
      }
      showErrorNotification(
        response?.data?.data?.message || "Verification failed"
      );
    } catch (error) {
      await handleCustomError(error);
      return false;
    }
  };

  return { verify };
};

export const usePanVerification = () => {
  const verify = async (panNumber: string) => {
    try {
      const response = await Pan_Verification(panNumber);
      const success = [200, 201].includes(response?.data?.data?.status_code);
      if (success) {
        showSuccessNotification("Pan verified successfully");
        return true;
      }
      showErrorNotification(
        response?.data?.data?.message || "Verification failed"
      );
    } catch (error) {
      await handleCustomError(error);
      return false;
    }
  };

  return { verify };
};

export const useAdhaarPanVerification = () => {
  const verify = async (id: number) => {
    try {
      const response = await Adhaar_Pan_Link(id);
      const success = [200, 201].includes(response?.data?.data?.status_code);
      if (success) {
        showSuccessNotification("Aadhaar and Pan verified successfully");
        return true;
      }
      showErrorNotification(
        response?.data?.data?.message || "Verification failed"
      );
    } catch (error) {
      await handleCustomError(error);
      return false;
    }
  };

  return { verify };
};

export const useEmailVerification = () => {
  const verify = async (email: string) => {
    try {
      const response = await Email_Verification(email);
      const success = [200, 201].includes(response?.data?.data?.status_code);
      if (success) {
        showSuccessNotification("Email verified successfully");
        return true;
      }
      showErrorNotification(
        response?.data?.data?.message || "Verification failed"
      );
    } catch (error) {
      await handleCustomError(error);
      return false;
    }
  };

  return { verify };
};
