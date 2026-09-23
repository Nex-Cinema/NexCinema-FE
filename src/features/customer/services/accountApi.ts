import axiosClient from '@/core/api/axiosClient';

/**
 * Lấy thông tin tài khoản profile của cá nhân.
 */
export const getMyProfile = async (): Promise<any> => {
  return axiosClient.get('/account/profile');
};

/**
 * Cập nhật thông tin tài khoản cá nhân.
 */
export const updateMyProfile = async (payload: {
  HoTen?: string;
  SoDienThoai?: string;
  NgaySinh?: string;
  GioiTinh?: string;
}): Promise<any> => {
  return axiosClient.put('/account/profile', payload);
};

/**
 * Đổi mật khẩu tài khoản.
 */
export const changePassword = async (payload: {
  MatKhauCu: string;
  MatKhauMoi: string;
}): Promise<any> => {
  return axiosClient.post('/account/change-password', payload);
};
