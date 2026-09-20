import { Clock, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getMovieVisuals } from '../../utils/visualHelper';
import MovieImage from './MovieImage';

const MovieCard = ({ movie, actionLabel = 'Đặt vé' }) => {
  const visuals = getMovieVisuals(movie);
  const genre = movie.TheLoai || movie.genres?.map((item) => item.name).join(', ') || 'Điện ảnh';

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/movie/${movie.MaPhim}`} className="relative block aspect-2/3 overflow-hidden">
        <MovieImage movie={movie} src={movie.HinhAnh || visuals.poster} alt={`Poster ${movie.TenPhim}`} className="size-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute right-2.5 top-2.5 rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-neutral-950 shadow-sm">{movie.GioiHanTuoi || 'P'}</span>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="client-primary-button"><Ticket size={17} />{actionLabel}</span>
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between gap-3 p-4">
        <div>
          <p className="mb-1 line-clamp-1 text-xs text-neutral-500">{genre}</p>
          <Link to={`/movie/${movie.MaPhim}`} className="line-clamp-1 text-base font-semibold text-neutral-950 transition hover:text-(--client-primary)">{movie.TenPhim}</Link>
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-3 text-xs text-neutral-500">
          <span className="flex items-center gap-1"><Clock size={14} />{movie.ThoiLuong > 0 ? `${movie.ThoiLuong} phút` : 'Đang cập nhật'}</span>
          <span className="font-semibold text-(--client-primary)">2D</span>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
