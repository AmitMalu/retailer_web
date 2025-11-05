import React from "react";
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

// export const showErrorNotification = (message: string) => {
//   toast.error(message, {
//     position: "top-right",
//     autoClose: 6000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//   });
// };

// notifications.ts
export const showErrorNotification = (content: string | React.ReactNode) => {
  const node =
    typeof content === "string"
      ? React.createElement(
          "div",
          { style: { whiteSpace: "pre-line", lineHeight: 1.4 } },
          content
        )
      : content;

  toast.error(node, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
