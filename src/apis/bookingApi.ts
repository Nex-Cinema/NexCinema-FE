import axiosClient from './axiosClient';
import {
  HoldSeatsPayload,
  CancelHeldSeatsPayload,
  SimulatedCheckoutPayload,
  RealCheckoutPayload,
} from '@/types/api.type';

export const getSeatMap = (maSuatChieu: string): Promise<any> => {
  return axiosClient.get(`/suat-chieu/${maSuatChieu}/ghe`);
};

/**
 * Giữ ghế cho khách hàng
 */
export const holdSeats = (maSuatChieu: string, seatIds: string[]): Promise<any> => {
  const payload: HoldSeatsPayload = {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  };
  return axiosClient.post('/dat-ve/giu-ghe', payload);
};

/**
 * Hủy giữ ghế thủ công
 */
export const cancelHeldSeats = (maSuatChieu: string, seatIds: string[]): Promise<any> => {
  const payload: CancelHeldSeatsPayload = {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  };
  return axiosClient.post('/dat-ve/huy-giu-ghe', payload);
};

/**
 * Thanh toán giả lập kết quả đặt vé
 */
export const simulatedCheckout = (payload: SimulatedCheckoutPayload): Promise<any> => {
  return axiosClient.post('/dat-ve/thanh-toan-gia-lap', payload);
};

/**
 * Thực hiện thanh toán đặt vé thực tế
 */
export const realCheckout = (payload: RealCheckoutPayload): Promise<any> => {
  return axiosClient.post('/dat-ve/thanh-toan', payload);
};
