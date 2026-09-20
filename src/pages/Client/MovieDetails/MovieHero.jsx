import { Play, Heart, Star } from 'lucide-react';
import { getMovieVisuals } from '../../../utils/visualHelper';

/**
 * MovieHero — left poster + right title/meta/actions block.
 * Pure presentational. All handlers and data passed via props.
 */
const MovieHero = ({
  movie,
  rawMovie,
  ratingSummary,
  hasShowtimes,
  onShowTrailer,
  onStartBooking,
}) => {
  return (
    <section className="grid grid-cols-1 items-start gap-10 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-8 lg:grid-cols-[280px_1fr]">
      {/* Poster */}
      <div className="mx-auto aspect-2/3 w-full max-w-70 overflow-hidden rounded-xl shadow-lg lg:mx-0">
        <img
          src={movie.poster_path}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = getMovieVisuals(rawMovie).poster;
          }}
        />
      </div>

      {/* Info + actions */}
      <div className="flex flex-col gap-6 text-left">
        <span className="text-sm font-bold uppercase tracking-widest text-(--client-primary)">Đang chiếu tại NexCinema</span>
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-neutral-950 md:text-5xl">
          {movie.title}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2 text-amber-500 font-semibold text-base">
          <Star size={18} fill="currentColor" />
          <span>
            {ratingSummary.DiemTrungBinh > 0
              ? `${ratingSummary.DiemTrungBinh} / 5 điểm`
              : 'Chưa có đánh giá'}{' '}
            ({ratingSummary.SoLuongDanhGia} đánh giá)
          </span>
        </div>

        {/* Description */}
        <p className="max-w-3xl text-base leading-7 text-neutral-600 md:text-lg">
          {movie.NoiDung || 'Chưa có mô tả nội dung cho phim này.'}
        </p>

        {/* Director / Cast */}
        <div className="mt-2 flex flex-col gap-1.5 border-t border-neutral-200 pt-4 text-sm font-medium text-neutral-600">
          <p>
            <span className="mr-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Đạo diễn:</span>
            <span className="text-neutral-950">
              {movie.DaoDien || 'Chưa cập nhật'}
            </span>
          </p>
          <p className="line-clamp-2">
            <span className="mr-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Diễn viên:</span>
            <span className="text-neutral-950">{movie.DienVien || 'Chưa cập nhật'}</span>
          </p>
        </div>

        {/* Runtime / Genre / Release */}
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-neutral-600 md:text-base">
          <span>{movie.runtime} phút</span>
          <span>•</span>
          <span>{movie.TheLoai}</span>
          <span>•</span>
          <span>Khởi chiếu: {movie.release_date}</span>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={onShowTrailer}
            className="client-secondary-button"
          >
            <Play size={16} fill="white" /> Xem Trailer
          </button>
          <button
            onClick={onStartBooking}
            disabled={!hasShowtimes}
            className="client-primary-button px-8"
          >
            {hasShowtimes ? 'Mua Vé Ngay' : 'Chưa có suất chiếu'}
          </button>
          <button className="client-icon-button" aria-label="Lưu phim yêu thích">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default MovieHero;
