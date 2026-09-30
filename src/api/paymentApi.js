import axiosClient from './axiosClient';

export const getPaymentGateways = () => axiosClient.get('/payment/gateways');

/**
 * Tạo link thanh toán PayOS
 * @param {string} maPhieuDat 
 */
export const createPayOSPayment = (maPhieuDat) => {
  return axiosClient.post('/payment/payos/create', { MaPhieuDat: maPhieuDat });
};

/**
 * Lấy trạng thái giao dịch thanh toán PayOS
 * @param {string} maGiaoDich 
 */
export const getPayOSPaymentStatus = (maGiaoDich) => {
  return axiosClient.get(`/payment/payos/${maGiaoDich}/status`);
};

/**
 * Tạo URL thanh toán VNPay Sandbox.
 *
 * @param {string} maPhieuDat - Mã phiếu đặt đang chờ thanh toán.
 * @returns {Promise<object>} Thông tin giao dịch và URL chuyển hướng.
 */
export const createVNPayPayment = (maPhieuDat) => {
  return axiosClient.post('/payment/vnpay/create', { MaPhieuDat: maPhieuDat });
};

/**
 * Lấy trạng thái giao dịch VNPay đã được backend cập nhật qua IPN.
 *
 * @param {string} maGiaoDich - Mã giao dịch nội bộ hoặc mã tham chiếu VNPay.
 * @returns {Promise<object>} Trạng thái giao dịch và phiếu đặt.
 */
export const getVNPayPaymentStatus = (maGiaoDich) => {
  return axiosClient.get(`/payment/vnpay/${maGiaoDich}/status`);
};
