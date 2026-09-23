import React from 'react';
import {
  Clock,
  Calendar,
  ShieldAlert,
  Languages,
  Film,
  Star,
  Ticket,
  Share2,
} from 'lucide-react';
import { MovieDetailsData } from '../types/movieDetails.type';

interface MovieInfoCardProps {
  movie: MovieDetailsData;
  onScrollToShowtimes: () => void;
  onShareMovie: () => void;
}

export const MovieInfoCard: React.FC<MovieInfoCardProps> = ({
  movie,
  onScrollToShowtimes,
  onShareMovie,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2]">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Poster image with Rating Badge */}
        <div className="relative w-full md:w-64 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-md bg-[#efeded]">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-2.5 bg-[#d71920] text-white font-extrabold text-sm px-2.5 py-1 rounded shadow-md tracking-wide">
            {movie.ratingBadge}
          </div>
        </div>

        {/* Metadata Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
                {movie.title}
              </h2>
              <p className="text-sm text-[#5f5e5e] mt-0.5">{movie.englishTitle}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <Clock className="w-4 h-4 text-[#d71920] shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Thời lượng:</span>
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <Calendar className="w-4 h-4 text-[#d71920] shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Khởi chiếu:</span>
                <span>{movie.releaseDate}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <ShieldAlert className="w-4 h-4 text-[#d71920] shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Độ tuổi:</span>
                <span className="text-[#ba1a1a] font-bold">{movie.ageRatingText}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <Languages className="w-4 h-4 text-[#d71920] shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Ngôn ngữ:</span>
                <span>{movie.language}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <Film className="w-4 h-4 text-[#d71920] shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Định dạng:</span>
                <span>{movie.formatText}</span>
              </div>
              <div className="flex items-center gap-2 text-[#5f5e5e]">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-[#1b1c1c] font-bold">Đánh giá:</span>
                <span className="font-extrabold text-[#1b1c1c]">{movie.ratingScore}</span>
                <span className="text-[#5f5e5e]">({movie.reviewCount})</span>
              </div>
            </div>

            {/* Genre line */}
            <div className="pt-3 border-t border-[#e4e2e2] flex items-baseline gap-1.5 text-xs text-[#5f5e5e]">
              <span className="text-[#1b1c1c] font-bold">Thể loại:</span>
              <span className="text-[#5d3f3c]">{movie.genres}</span>
            </div>
          </div>

          {/* Primary CTA Button Row */}
          <div className="mt-6 pt-4 border-t border-[#e4e2e2] flex items-center gap-3 flex-wrap">
            <button
              onClick={onScrollToShowtimes}
              className="flex-1 min-w-[200px] h-12 bg-[#d71920] hover:bg-[#ae0011] text-white rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Ticket className="w-5 h-5" />
              <span>ĐẶT VÉ NGAY</span>
            </button>

            <button
              onClick={onShareMovie}
              className="h-12 w-12 rounded-lg bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] flex items-center justify-center transition-colors shadow-sm cursor-pointer"
              title="Chia sẻ phim"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieInfoCard;
