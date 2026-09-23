import axiosPublic from '@/core/api/axiosPublic';
import axiosClient from '@/core/api/axiosClient';

/**
 * Lấy danh sách phim đang chiếu hoặc tất cả phim.
 */
export const getMovies = async (params: Record<string, any> = {}): Promise<any> => {
  return axiosPublic.get('/phim', { params });
};

/**
 * Lấy chi tiết thông tin 1 bộ phim theo mã phim.
 */
export const getMovieDetail = async (maPhim: string): Promise<any> => {
  return axiosPublic.get(`/phim/${maPhim}`);
};

/**
 * Lấy danh sách đánh giá của bộ phim.
 */
export const getMovieReviews = async (maPhim: string): Promise<any> => {
  return axiosPublic.get(`/phim/${maPhim}/danh-gia`);
};

/**
 * Lấy danh sách suất chiếu của bộ phim.
 */
export const getMovieShowtimes = async (maPhim: string): Promise<any> => {
  return axiosPublic.get(`/phim/${maPhim}/suat-chieu`);
};

/**
 * Tạo đánh giá mới cho phim (yêu cầu đăng nhập - JWT header).
 */
export const createReview = async (payload: {
  MaPhim: string;
  SoSao: number;
  BinhLuan?: string;
}): Promise<any> => {
  return axiosClient.post('/danh-gia', payload);
};
