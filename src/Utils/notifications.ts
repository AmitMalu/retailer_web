import { toast } from "react-toastify";

export const showSuccessNotification = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

export const showErrorNotification = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
