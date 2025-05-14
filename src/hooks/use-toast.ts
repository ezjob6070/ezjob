
import { Toast, toast as sonnerToast } from "sonner";

export const toast = sonnerToast;

export type ToastProps = typeof toast;

export interface UseToastReturn {
  toast: ToastProps;
}

export const useToast = (): UseToastReturn => {
  return {
    toast,
  };
};
