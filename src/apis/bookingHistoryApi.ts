import axiosClient from './axiosClient';

/**
 * Lấy lịch sử giao dịch/đặt vé của khách hàng hiện tại
 */
export const getBookingHistory = (params?: Record<string, any>): Promise<any> => {
  return axiosClient.get('/lich-su-giao-dich', { params });
};

/**
 * Lấy chi tiết phiếu đặt vé của khách hàng hiện tại
 */
export const getBookingDetail = (maPhieuDat: string): Promise<any> => {
  return axiosClient.get(`/lich-su-giao-dich/${maPhieuDat}`);
};
