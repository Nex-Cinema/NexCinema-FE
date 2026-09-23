import { useState, useEffect, useMemo, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMovieDetail, getMovieReviews, getMovieShowtimes, createReview } from '@/apis/movieApi';
import { getMovieVisuals } from '@/utils/visualHelper';
import toast from 'react-hot-toast';

/**
 * useMovieDetail
 *
 * Fetches movie details, reviews, and showtimes concurrently.
 * Also owns review submission logic.
 *
 * @param maPhim – movie ID from route params
 */
const useMovieDetail = (maPhim: string) => {
  const navigate = useNavigate();

  const [rawMovie, setRawMovie] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [ratingSummary, setRatingSummary] = useState({ DiemTrungBinh: 0, SoLuongDanhGia: 0 });
  const [showtimes, setShowtimes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!maPhim) return;

    const fetchMovieData = async () => {
      setLoading(true);
      try {
        const [movieRes, reviewsRes, showtimesRes]: [any, any, any] = await Promise.all([
          getMovieDetail(maPhim),
          getMovieReviews(maPhim),
          getMovieShowtimes(maPhim),
        ]);
        setRawMovie(movieRes);
        setReviews(reviewsRes?.data || []);
        setRatingSummary(reviewsRes?.ratingSummary || { DiemTrungBinh: 0, SoLuongDanhGia: 0 });
        setShowtimes(showtimesRes || []);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết phim:', err);
        toast.error('Không thể tải thông tin bộ phim!');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [maPhim]);

  const movie = useMemo(() => {
    if (!rawMovie) return null;
    const visuals = getMovieVisuals(rawMovie);
    return {
      ...rawMovie,
      _id: rawMovie.MaPhim,
      id: rawMovie.MaPhim,
      title: rawMovie.TenPhim,
      poster_path: rawMovie.HinhAnh || visuals.poster,
      backdrop_path: visuals.backdrop,
      release_date: rawMovie.NgayKhoiChieu
        ? new Date(rawMovie.NgayKhoiChieu).toLocaleDateString('vi-VN')
        : '',
      runtime: rawMovie.ThoiLuong,
      genres: rawMovie.TheLoai
        ? rawMovie.TheLoai.split(',').map((g: string) => ({ name: g.trim() }))
        : [],
      videoUrl: visuals.trailer,
    };
  }, [rawMovie]);

  const handleOpenReviewModal = () => {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'CUSTOMER') {
      toast.error('Vui lòng đăng nhập tài khoản khách hàng để đánh giá phim!');
      navigate('/login', { state: { from: `/movie/${maPhim}` } });
      return;
    }
    setRating(5);
    setComment('');
    setIsReviewOpen(true);
  };

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('userRole');
    if (!token || role !== 'CUSTOMER') {
      toast.error('Phiên đăng nhập không hợp lệ hoặc bạn không phải là khách hàng!');
      navigate('/login', { state: { from: `/movie/${maPhim}` } });
      return;
    }
    if (rating < 1 || rating > 5) {
      toast.error('Số sao đánh giá phải từ 1 đến 5!');
      return;
    }
    setIsReviewSubmitting(true);
    const toastId = toast.loading('Đang gửi đánh giá...');
    try {
      const payload: Record<string, any> = { MaPhim: rawMovie?.MaPhim || maPhim, SoSao: Number(rating) };
      if (comment.trim()) payload.BinhLuan = comment.trim();
      await createReview(payload);
      toast.success('Đánh giá phim thành công!');
      setIsReviewOpen(false);
      setComment('');
      setRating(5);

      const [reviewsRes, movieRes]: [any, any] = await Promise.all([
        getMovieReviews(maPhim),
        getMovieDetail(maPhim),
      ]);
      setReviews(reviewsRes?.data || []);
      setRatingSummary(reviewsRes?.ratingSummary || { DiemTrungBinh: 0, SoLuongDanhGia: 0 });
      setRawMovie(movieRes);
    } catch (err: any) {
      console.error('Lỗi khi gửi đánh giá:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
        navigate('/login', { state: { from: `/movie/${maPhim}` } });
      } else {
        toast.error(err.response?.data?.message || err.message || 'Gửi đánh giá thất bại.');
      }
    } finally {
      setIsReviewSubmitting(false);
      toast.dismiss(toastId);
    }
  };

  return {
    rawMovie,
    movie,
    reviews,
    ratingSummary,
    showtimes,
    loading,
    isReviewOpen,
    rating,
    comment,
    hoverRating,
    isReviewSubmitting,
    handleOpenReviewModal,
    handleReviewSubmit,
    onCloseReview: () => setIsReviewOpen(false),
    onSetRating: setRating,
    onHoverRating: setHoverRating,
    onSetComment: setComment,
  };
};

export default useMovieDetail;
