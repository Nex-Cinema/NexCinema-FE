import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ticket, Clock, Star } from 'lucide-react';
import { Movie } from '@/types/movie.type';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import AgeBadge from './AgeBadge';
import MoviePoster from './MoviePoster';

export interface MovieCardProps {
  movie: Movie;
  onBookingClick?: (movie: Movie) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onBookingClick }) => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  const handleBooking = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetUrl = `${ROUTES.MOVIES.DETAIL(String(movie.id))}#lich-chieu-section`;
    if (!requireAuth(undefined, targetUrl)) {
      return;
    }
    if (onBookingClick) {
      onBookingClick(movie);
    } else {
      navigate(targetUrl);
    }
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100">
      {/* POSTER & OVERLAY BADGES */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
        <Link to={ROUTES.MOVIES.DETAIL(String(movie.id))}>
          <MoviePoster
            src={movie.poster}
            alt={movie.title}
            className="group-hover:scale-105"
          />
        </Link>

        {/* TOP LEFT TAG */}
        {movie.tag && (
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            <span
              className={`px-2 py-0.5 rounded font-bold text-[11px] shadow-xs uppercase tracking-wider ${
                movie.tag === 'HOT' ? 'bg-[#d71920]' : 'bg-blue-700 text-white'
              }`}
            >
              {movie.tag}
            </span>
          </div>
        )}

        {/* TOP RIGHT BADGES */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 pointer-events-none">
          <AgeBadge rating={movie.ageRating} />
          {movie.formats.length > 0 && (
            <span className="px-2 py-0.5 rounded bg-gray-900/80 backdrop-blur-xs text-white text-[11px] font-semibold">
              {movie.formats.join(' / ')}
            </span>
          )}
        </div>

        {/* QUICK BUY HOVER OVERLAY */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          {onBookingClick ? (
            <button
              onClick={handleBooking}
              className="px-4 py-2.5 rounded-lg bg-[#d71920] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Ticket className="w-4 h-4" /> Đặt vé
            </button>
          ) : (
            <Link
              to={ROUTES.MOVIES.DETAIL(String(movie.id))}
              className="px-4 py-2.5 rounded-lg bg-[#d71920] hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <Ticket className="w-4 h-4" /> Xem chi tiết
            </Link>
          )}
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-2 text-left">
        <div>
          <div className="flex items-center justify-between text-gray-500 text-xs mb-1">
            <span className="truncate max-w-[130px]">{movie.genre}</span>
            <span className="text-amber-500 font-bold flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-none" /> {movie.rating}
            </span>
          </div>
          <Link to={ROUTES.MOVIES.DETAIL(String(movie.id))}>
            <h3 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-[#d71920] transition-colors">
              {movie.title}
            </h3>
          </Link>
        </div>

        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-500 text-xs">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {movie.duration} phút
          </span>
          <span className="text-[#d71920] font-semibold">
            {movie.formats.join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
