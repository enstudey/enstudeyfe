export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastEventDetail {
  message: string;
  type: ToastType;
}

export const toast = {
  show: (message: string, type: ToastType = "info") => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent<ToastEventDetail>("show-toast", {
        detail: { message, type }
      });
      window.dispatchEvent(event);
    }
  },
  success: (message: string) => toast.show(message, "success"),
  error: (message: string) => toast.show(message, "error"),
  warning: (message: string) => toast.show(message, "warning"),
  info: (message: string) => toast.show(message, "info"),
};
