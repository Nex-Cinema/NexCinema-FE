import axiosClient from './axiosClient';
import { CancelBookingPayload, RequestRefundPayload } from '@/types/api.type';

/**
 * Hủy phiếu đặt vé
 */
export const cancelBooking = (maPhieuDat: string, payload: CancelBookingPayload): Promise<any> => {
  return axiosClient.post(`/dat-ve/${maPhieuDat}/huy`, payload);
};

/**
 * Gửi yêu cầu hoàn tiền
 */
export const requestRefund = (payload: RequestRefundPayload): Promise<any> => {
  return axiosClient.post('/hoan-tien/yeu-cau', payload);
};

/**
 * Lấy danh sách yêu cầu hoàn tiền của tôi
 */
export const getMyRefundRequests = (params?: { page?: number; limit?: number }): Promise<any> => {
  return axiosClient.get('/hoan-tien/cua-toi', { params });
};
