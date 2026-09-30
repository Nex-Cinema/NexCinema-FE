import axiosClient from './axiosClient';

/**
 * Lấy sơ đồ ghế của một suất chiếu.
 *
 * @param {string} maSuatChieu - Mã suất chiếu.
 * @param {AbortSignal} [signal] - Signal để hủy request khi component unmount/đổi suất.
 * @returns {Promise<object>} Sơ đồ ghế đã được axios interceptor unwrap.
 */
export const getSeatMap = (maSuatChieu, signal) => {
  return axiosClient.get(`/suat-chieu/${maSuatChieu}/ghe`, {
    signal,
    timeout: 10000,
  });
};

/**
 * Giữ ghế cho khách hàng
 * @param {string} maSuatChieu 
 * @param {string[]} seatIds 
 */
export const holdSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  });
};

/**
 * Hủy giữ ghế thủ công
 * @param {string} maSuatChieu 
 * @param {string[]} seatIds 
 */
export const cancelHeldSeats = (maSuatChieu, seatIds) => {
  return axiosClient.post('/dat-ve/huy-giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  });
};

/**
 * Thanh toán giả lập kết quả đặt vé
 * @param {object} payload
 * @param {string} payload.MaSuatChieu
 * @param {string[]} payload.DanhSachMaGheSuatChieu
 * @param {string} payload.PhuongThucThanhToan - 'TIEN_MAT'
 * @param {string} payload.KetQuaThanhToan - 'THANH_CONG' | 'THAT_BAI'
 */
export const simulatedCheckout = (payload) => {
  return axiosClient.post('/dat-ve/thanh-toan-gia-lap', payload);
};

/**
 * Thực hiện thanh toán đặt vé thực tế
 * @param {object} payload
 * @param {string} payload.MaSuatChieu
 * @param {string[]} payload.DanhSachMaGheSuatChieu
 * @param {string} payload.PhuongThucThanhToan - 'TIEN_MAT' | 'PAYOS'
 */
export const realCheckout = (payload) => {
  return axiosClient.post('/dat-ve/thanh-toan', payload);
};

