import React from 'react';
import { Users } from 'lucide-react';
import { CastMember } from '../types/movieDetails.type';

interface MovieCastSectionProps {
  director: {
    name: string;
    avatarUrl: string;
  };
  cast: CastMember[];
}

export const MovieCastSection: React.FC<MovieCastSectionProps> = ({
  director,
  cast,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-[#d71920]" />
        <h3 className="font-bold text-lg text-[#1b1c1c]">Đạo diễn & Diễn viên</h3>
      </div>

      {/* Director */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <span className="text-xs font-semibold text-[#5f5e5e] w-24 shrink-0">
          Đạo diễn:
        </span>
        <div className="inline-flex items-center gap-2 bg-[#f5f3f3] px-3 py-1.5 rounded-lg shadow-sm">
          <img
            src={director.avatarUrl}
            alt={director.name}
            className="w-7 h-7 rounded-full object-cover"
          />
          <span className="font-semibold text-xs text-[#1b1c1c]">
            {director.name}
          </span>
        </div>
      </div>

      {/* Cast Members */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 pt-1">
        <span className="text-xs font-semibold text-[#5f5e5e] w-24 shrink-0 sm:pt-2">
          Diễn viên:
        </span>
        <div className="flex flex-wrap gap-2 flex-1">
          {cast.map((actor, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 bg-[#f5f3f3] hover:bg-[#e4e2e2] px-3 py-1.5 rounded-lg transition-colors"
            >
              <img
                src={actor.avatarUrl}
                alt={actor.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <div className="flex flex-col text-left">
                <span className="font-semibold text-xs text-[#1b1c1c]">{actor.name}</span>
                <span className="text-[11px] text-[#5f5e5e]">{actor.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCastSection;
