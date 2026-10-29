import { toast, type ToastContent, type ToastOptions } from "react-toastify";

/**
 * Shared toast defaults: one copy per message.
 * The same text shown again (e.g. several empty tables each saying "No records found")
 * reuses the toast that is already on screen instead of stacking a new one.
 */
const withMessageId = (content: ToastContent, options?: ToastOptions): ToastOptions | undefined =>
  options?.toastId || typeof content !== "string" ? options : { ...options, toastId: content };

for (const type of ["success", "error", "warn", "warning", "info"] as const) {
  const show = toast[type];
  toast[type] = ((content: ToastContent, options?: ToastOptions) =>
    show(content, withMessageId(content, options))) as typeof show;
}

/** Props for the single <ToastContainer /> of the app. */
export const toastContainerProps = {
  position: "top-center",
  autoClose: 3500,
  hideProgressBar: true,
  newestOnTop: true,
  closeOnClick: true,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: false,
  limit: 3,
  theme: "light",
  className: "scs-toast-container",
} as const;
