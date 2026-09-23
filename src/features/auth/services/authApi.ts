import axiosPublic from '@/core/api/axiosPublic';
import {
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '@/types/api.type';

/**
 * Gửi yêu cầu mã OTP khôi phục mật khẩu tới email.
 */
export const forgotPassword = async (email: string): Promise<any> => {
  const payload: ForgotPasswordPayload = { Email: email };
  return axiosPublic.post('/auth/forgot-password', payload);
};

/**
 * Xác thực mã OTP khôi phục mật khẩu.
 */
export const verifyResetOtp = async (email: string, otp: string): Promise<any> => {
  const payload: VerifyOtpPayload = { Email: email, Otp: otp };
  return axiosPublic.post('/auth/verify-reset-otp', payload);
};

/**
 * Đặt lại mật khẩu mới.
 */
export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
): Promise<any> => {
  const payload: ResetPasswordPayload = {
    Email: email,
    Otp: otp,
    MatKhauMoi: newPassword,
    XacNhanMatKhauMoi: confirmPassword,
  };
  return axiosPublic.post('/auth/reset-password', payload);
};
