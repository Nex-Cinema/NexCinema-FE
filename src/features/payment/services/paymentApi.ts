import axiosClient from '@/core/api/axiosClient';

/**
 * Tạo URL thanh toán VNPay.
 */
export const createVNPayPaymentUrl = async (payload: {
  MaPhieuDat: string;
  SoTien: number;
}): Promise<any> => {
  return axiosClient.post('/payment/create-vnpay-url', payload);
};

/**
 * Tạo VietQR PayOS payment link.
 */
export const createPayOSPaymentLink = async (payload: {
  MaPhieuDat: string;
  SoTien: number;
}): Promise<any> => {
  return axiosClient.post('/payment/create-payos-link', payload);
};

/**
 * Kiểm tra trạng thái thanh toán PayOS (polling endpoint).
 */
export const checkPayOSStatus = async (orderId: string): Promise<any> => {
  return axiosClient.get(`/payment/payos-status/${orderId}`);
};
