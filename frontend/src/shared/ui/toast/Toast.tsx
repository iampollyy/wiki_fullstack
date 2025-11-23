import { useEffect } from "react";
import styles from "./toast.module.scss";
import close_colored_icon from "@assets/icons/close_colored_icon.svg";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const Toast = ({ toast, onClose }: ToastProps) => {
  useEffect(() => {
    const duration = toast.duration ?? 3000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const handleClose = () => {
    onClose(toast.id);
  };

  return (
    <div
      className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}
      role="alert"
    >
      <div className={styles.toast__content}>
        <span className={styles.toast__message}>{toast.message}</span>
      </div>
      <button
        className={styles.toast__close}
        onClick={handleClose}
        aria-label="Close notification"
        type="button"
      >
        <img src={close_colored_icon} alt="Close" />
      </button>
    </div>
  );
};

