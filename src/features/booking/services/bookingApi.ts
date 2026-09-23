import axiosPublic from '@/core/api/axiosPublic';
import axiosClient from '@/core/api/axiosClient';

/**
 * Lấy sơ đồ ghế & trạng thái ghế theo mã suất chiếu.
 */
export const getSeatMapByShowtime = async (maSuatChieu: string): Promise<any> => {
  return axiosPublic.get(`/suat-chieu/${maSuatChieu}/ghe`);
};

/**
 * Giữ ghế thời gian thực (đặt trước ghế trong 10 phút).
 */
export const holdSeats = async (payload: {
  MaSuatChieu: string;
  DanhSachGhe: string[];
}): Promise<any> => {
  return axiosClient.post('/dat-ve/giu-ghe', payload);
};

/**
 * Hủy giữ ghế. Supports both object payload and positional arguments.
 */
export const cancelHeldSeats = async (
  maSuatChieuOrPayload: any,
  seatsArg?: string[]
): Promise<any> => {
  const payload =
    typeof maSuatChieuOrPayload === 'string'
      ? { MaSuatChieu: maSuatChieuOrPayload, DanhSachGhe: seatsArg || [] }
      : maSuatChieuOrPayload;
  return axiosClient.post('/dat-ve/huy-giu-ghe', payload);
};

/**
 * Tạo phiếu đặt vé mới.
 */
export const createBookingTicket = async (payload: {
  MaSuatChieu: string;
  DanhSachGhe: string[];
  PhuongThucThanhToan: string;
}): Promise<any> => {
  return axiosClient.post('/dat-ve', payload);
};
