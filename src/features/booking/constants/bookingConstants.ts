export const MAX_SEATS_PER_BOOKING = 8;
export const SEAT_HOLD_DURATION_S = 600; // 10 minutes

export const SEAT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K'] as const;
export const VIP_ROWS = ['G', 'H', 'I'] as const;
export const COUPLE_ROW = 'K';

export const PRICE_STANDARD = 50000;
export const PRICE_VIP = 110000;
export const PRICE_COUPLE = 110000; // per seat (220,000 đ per pair)

export const AGE_RESTRICTED_RATINGS = ['C13', 'C16', 'C18'] as const;

export const STORAGE_KEYS = {
  BOOKING_DRAFT: 'booking_draft',
  BOOKING_CONFIRMATION: 'booking_confirmation',
} as const;
