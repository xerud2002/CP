/**
 * Toast notification utilities using Sonner
 * Provides consistent toast notifications across the application
 */

import { toast } from 'sonner';
import { getErrorMessage } from './errorMessages';

/**
 * Success toast notification
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
  });
};

/**
 * Error toast notification
 * Automatically converts error objects to user-friendly messages
 */
export const showError = (error: unknown) => {
  const message = getErrorMessage(error);
  toast.error(message, {
    duration: 5000,
  });
};

/**
 * Info toast notification
 */
export const showInfo = (message: string) => {
  toast.info(message, {
    duration: 3000,
  });
};

/**
 * Warning toast notification
 */
export const showWarning = (message: string) => {
  toast.warning(message, {
    duration: 4000,
  });
};

/**
 * Loading toast notification
 * Returns an ID that can be used to dismiss or update the toast
 */
export const showLoading = (message: string = 'Se procesează...') => {
  return toast.loading(message);
};

/**
 * Dismiss a specific toast by ID
 */
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

/**
 * Promise toast - automatically shows loading, success, or error based on promise result
 */
export const showPromise = <T,>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: unknown) => string);
  }
) => {
  return toast.promise(promise, messages);
};
