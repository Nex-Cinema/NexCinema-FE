import axiosClient from '@/core/api/axiosClient';

/**
 * Lấy danh sách phiếu đặt vé / lịch sử đặt vé của cá nhân người dùng.
 */
export const getMyBookingHistory = async (params: Record<string, any> = {}): Promise<any> => {
  return axiosClient.get('/giao-dich/lich-su-dat-ve', { params });
};

/**
 * Lấy chi tiết 1 phiếu đặt vé theo mã phiếu đặt.
 */
export const getMyBookingDetail = async (maPhieuDat: string): Promise<any> => {
  return axiosClient.get(`/giao-dich/phieu-dat/${maPhieuDat}`);
};
