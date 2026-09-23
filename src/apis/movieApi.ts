import axiosClient from './axiosClient';

export const getMovies = (params?: Record<string, any>): Promise<any> => {
  return axiosClient.get('/phim', { params });
};

export const getMovieDetail = (maPhim: string): Promise<any> => {
  return axiosClient.get(`/phim/${maPhim}`);
};

export const getMovieReviews = (maPhim: string, params?: Record<string, any>): Promise<any> => {
  return axiosClient.get(`/phim/${maPhim}/danh-gia`, { params });
};

export const getMovieShowtimes = (maPhim: string): Promise<any> => {
  return axiosClient.get(`/phim/${maPhim}/suat-chieu`);
};

export const createReview = (payload: Record<string, any>): Promise<any> => {
  return axiosClient.post('/danh-gia', payload);
};
