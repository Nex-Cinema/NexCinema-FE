/**
 * paymentMethodHelper.ts
 *
 * Helper utilities for formatting payment methods (VNPay, PayOS)
 * and resolving human-readable Vietnamese descriptions & icons.
 */

export interface PaymentMethodOption {
  id: 'VNPAY' | 'PAYOS';
  name: string;
  description: string;
  badge: string;
  recommended?: boolean;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: 'VNPAY',
    name: 'Cổng thanh toán VNPay',
    description: 'Thẻ ATM, Thẻ quốc tế Visa/Mastercard, VNPay-QR',
    badge: 'Khuyên dùng',
    recommended: true,
  },
  {
    id: 'PAYOS',
    name: 'Quét mã VietQR (PayOS)',
    description: 'Quét mã QR bằng ứng dụng ngân hàng (Auto-confirm)',
    badge: 'Nhanh chóng',
  },
];

export const getPaymentMethodName = (methodId: string): string => {
  const method = PAYMENT_METHODS.find((m) => m.id === methodId);
  return method ? method.name : methodId || 'Không xác định';
};
