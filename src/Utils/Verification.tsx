import {
  Adhaar_Pan_Link,
  Adhaar_Verification,
  Bank_Verification,
  Email_Verification,
  Pan_Verification,
} from "@/Services/api";
import {
  showErrorNotification,
  showSuccessNotification,
} from "./notifications";
import { handleCustomError } from "./handleCustomError";
import { BankVerificationRequest } from "@/Common/interface";

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


export const useBankVerification = () => {
  const verify = async ({ id_number, ifsc, ifsc_details }: BankVerificationRequest) => {
    try {
      const response = await Bank_Verification({
        id_number,
        ifsc,
        ifsc_details,
      });
      const success = [200, 201].includes(response?.data?.data?.status_code);
      if (success) {
        return response?.data;
      }
      showErrorNotification(
        response?.data?.data?.message || "Bank Verification failed"
      );
      console.error(response || "Bank Verification failed");

    } catch (error) {
      await handleCustomError(error);
      return false;
    }
  };

  return { verify };
};
