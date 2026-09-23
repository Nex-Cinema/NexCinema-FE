import { toast } from "react-hot-toast";

export interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
      error?: string;
      errors?: Array<{ message?: string }>;
    };
  };
  message?: string;
}

export const getErrorMessage = (error: unknown, fallback = "Thao tác thất bại."): string => {
  if (!error) return fallback;

  const err = error as ApiErrorResponse;
  if (err.response?.data) {
    const data = err.response.data;
    if (data.message) return data.message;
    if (data.error) return data.error;
    if (Array.isArray(data.errors) && data.errors.length > 0 && data.errors[0]?.message) {
      return data.errors[0].message;
    }
  }

  if (err.message) return err.message;

  return fallback;
};

export const showSuccess = (message: string): void => {
  toast.success(message);
};

export const showError = (message: string): void => {
  toast.error(message);
};

export const showInfo = (message: string): void => {
  toast(message, {
    icon: "ℹ️",
  });
};

export const showWarning = (message: string): void => {
  toast(message, {
    icon: "⚠️",
  });
};
