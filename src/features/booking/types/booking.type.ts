export type SeatType = 'STANDARD' | 'VIP' | 'COUPLE';
export type SeatStatus = 'AVAILABLE' | 'SELECTED' | 'SOLD' | 'HELD';

export interface Seat {
  id: string; // e.g., "A1", "J4"
  row: string; // e.g., "A", "J"
  col: number; // e.g., 1, 4
  type: SeatType;
  price: number;
  status: SeatStatus;
}

export interface ShowtimePill {
  id: string;
  time: string;
  isCurrent?: boolean;
  seatsLeft?: number;
  isSoldOut?: boolean;
}

export interface BookingDraft {
  movieId: string;
  movieTitle: string;
  showtimeId: string;
  showtimeTime: string;
  showtimeDate: string;
  roomName: string;
  formatText: string;
  seats: string[];
  totalAmount: number;
  holdTimeLeft: number;
  holdStartedAt: number;
}

export interface BookingConfirmationData {
  orderCode: string;
  movieTitle: string;
  formatText: string;
  cinemaName: string;
  roomName: string;
  showtime: string;
  seats: string[];
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdDate: string;
}
