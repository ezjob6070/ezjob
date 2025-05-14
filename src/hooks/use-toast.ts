
import { toast as sonnerToast, Toast } from "sonner";

export const toast = sonnerToast;

export interface UseToastProps {
  toast: typeof sonnerToast;
}

export const useToast = (): UseToastProps => {
  return {
    toast: sonnerToast,
  };
};
