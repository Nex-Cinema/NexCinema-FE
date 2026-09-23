/**
 * Payment method normalized constants and translation labels.
 * Used across client checkout, payment pages, and admin dashboards.
 */

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TIEN_MAT: "Tiền mặt",
  CHUYEN_KHOAN: "Chuyển khoản",
  VNPAY: "VNPay",
  PAYOS: "PayOS",
  MOMO: "MoMo (cũ)",
  CARD: "Thẻ Quốc tế",
};

/**
 * Normalizes any payment method string variation to the standard uppercase frontend enum:
 * 'PAYOS' | 'VNPAY' | 'MOMO' | 'TIEN_MAT' | 'CHUYEN_KHOAN' | 'CARD'
 */
export const normalizePaymentMethod = (method?: string | null): string => {
  if (!method) return '';
  const m = method.toUpperCase().trim();
  if (m.includes('PAYOS')) return 'PAYOS';
  if (m.includes('VNPAY') || m.includes('VNP_') || m === 'VNPAY') return 'VNPAY';
  if (m.includes('MOMO')) return 'MOMO';
  if (m.includes('TIEN_MAT') || m.includes('CASH') || m === 'TIỀN MẶT') return 'TIEN_MAT';
  if (m.includes('CHUYEN_KHOAN') || m === 'CHUYỂN KHOẢN' || m === 'TRANSFER') return 'CHUYEN_KHOAN';
  if (m.includes('CARD') || m.includes('THẺ QUỐC TẾ')) return 'CARD';
  return method;
};

/**
 * Gets the localized display label for a payment method.
 */
export const getPaymentMethodLabel = (method?: string | null): string => {
  if (!method) return '';
  const normalized = normalizePaymentMethod(method);
  return PAYMENT_METHOD_LABELS[normalized] || method;
};
