// API Request & Response Contracts for NexCinema

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: ApiPagination;
}

export interface ApiPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// ── Auth API Types ─────────────────────────────────────────────────────────────
export interface ForgotPasswordPayload {
  Email: string;
}

export interface VerifyOtpPayload {
  Email: string;
  Otp: string;
}

export interface ResetPasswordPayload {
  Email: string;
  Otp: string;
  MatKhauMoi: string;
  XacNhanMatKhauMoi: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken?: string;
}

// ── Account API Types ──────────────────────────────────────────────────────────
export interface CustomerProfileData {
  MaNguoiDung: string;
  HoTen: string;
  Email: string;
  SoDienThoai?: string;
  NgaySinh?: string;
  GioiTinh?: string;
  AvatarUrl?: string;
}

export interface UpdateCustomerProfilePayload {
  HoTen?: string;
  SoDienThoai?: string;
  NgaySinh?: string;
  GioiTinh?: string;
}

export interface ChangePasswordPayload {
  MatKhauCu: string;
  MatKhauMoi: string;
  XacNhanMatKhauMoi: string;
}

// ── Booking API Types ──────────────────────────────────────────────────────────
export interface SeatMapItem {
  MaGheSuatChieu: string;
  MaSuatChieu: string;
  MaGhe: string;
  TrangThai: 'TRONG' | 'DA_DAT' | 'DANG_GIU';
  Ghe?: {
    MaGhe: string;
    ViTriDay: string;
    ViTriCot: number;
    LoaiGhe?: {
      TenLoaiGhe: string;
      PhuThu: number;
    };
  };
}

export interface HoldSeatsPayload {
  MaSuatChieu: string;
  DanhSachMaGheSuatChieu: string[];
}

export interface CancelHeldSeatsPayload {
  MaSuatChieu: string;
  DanhSachMaGheSuatChieu: string[];
}

export interface SimulatedCheckoutPayload {
  MaSuatChieu: string;
  DanhSachMaGheSuatChieu: string[];
  PhuongThucThanhToan: 'VNPAY' | 'TIEN_MAT' | 'PAYOS';
  KetQuaThanhToan: 'THANH_CONG' | 'THAT_BAI';
}

export interface RealCheckoutPayload {
  MaSuatChieu: string;
  DanhSachMaGheSuatChieu: string[];
  PhuongThucThanhToan: 'VNPAY' | 'TIEN_MAT' | 'PAYOS';
}

// ── Payment API Types ──────────────────────────────────────────────────────────
export interface CreatePaymentPayload {
  MaPhieuDat: string;
}

export interface PaymentUrlResponse {
  paymentUrl: string;
  maGiaoDich: string;
  orderCode?: string;
}

export interface PaymentStatusResponse {
  maGiaoDich: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  maPhieuDat?: string;
  amount?: number;
}

// ── Refund API Types ───────────────────────────────────────────────────────────
export interface CancelBookingPayload {
  LyDoHoan: string;
}

export interface RequestRefundPayload {
  MaPhieuDat: string;
  LyDo: string;
}
