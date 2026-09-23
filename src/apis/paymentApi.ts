import axiosClient from './axiosClient';
import { CreatePaymentPayload } from '@/types/api.type';

/**
 * Tạo link thanh toán PayOS
 */
export const createPayOSPayment = (maPhieuDat: string): Promise<any> => {
  const payload: CreatePaymentPayload = { MaPhieuDat: maPhieuDat };
  return axiosClient.post('/payment/payos/create', payload);
};

/**
 * Lấy trạng thái giao dịch thanh toán PayOS
 */
export const getPayOSPaymentStatus = (maGiaoDich: string): Promise<any> => {
  return axiosClient.get(`/payment/payos/${maGiaoDich}/status`);
};

/**
 * Tạo link thanh toán VNPay
 */
export const createVNPayPayment = (maPhieuDat: string): Promise<any> => {
  const payload: CreatePaymentPayload = { MaPhieuDat: maPhieuDat };
  return axiosClient.post('/payment/vnpay/create', payload);
};

/**
 * Lấy trạng thái giao dịch thanh toán VNPay
 */
export const getVNPayPaymentStatus = (maGiaoDich: string): Promise<any> => {
  return axiosClient.get(`/payment/vnpay/${maGiaoDich}/status`);
};
