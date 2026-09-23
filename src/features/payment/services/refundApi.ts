import axiosClient from '@/core/api/axiosClient';

/**
 * Gửi yêu cầu hoàn tiền vé (dành cho Khách hàng).
 */
export const requestRefundTicket = async (payload: {
  MaPhieuDat: string;
  LyDoHoanTien?: string;
}): Promise<any> => {
  return axiosClient.post('/giao-dich/yeu-cau-hoan-tien', payload);
};

/**
 * Lấy lịch sử các yêu cầu hoàn tiền của cá nhân người dùng.
 */
export const getMyRefundRequests = async (): Promise<any> => {
  return axiosClient.get('/giao-dich/yeu-cau-hoan-tien/me');
};
