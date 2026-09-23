import React from 'react';
import { Play } from 'lucide-react';

interface MovieHeroProps {
  backdropUrl: string;
  tagline: string;
  title: string;
  onOpenTrailer: () => void;
}

export const MovieHero: React.FC<MovieHeroProps> = ({
  backdropUrl,
  tagline,
  title,
  onOpenTrailer,
}) => {
  return (
    <section className="relative w-full h-[460px] md:h-[540px] bg-[#1b1c1c] overflow-hidden">
      {/* Background Visual */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{ backgroundImage: `url('${backdropUrl}')` }}
      />
      {/* Vignette Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/60 to-black/40" />
      <div className="absolute inset-0 bg-radial from-transparent to-black/70" />

      {/* Hero Banner Content */}
      <div className="relative max-w-[1280px] h-full mx-auto px-4 lg:px-6 flex flex-col justify-end pb-12 z-10">
        <div className="flex flex-col items-start gap-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-[#1b1c1c]/80 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
            <span>{tagline}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
            {title}
          </h1>

          {/* Play Trailer CTA */}
          <div className="pt-1 flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenTrailer}
              className="group inline-flex items-center gap-3 px-6 py-3 bg-white/95 hover:bg-white text-[#1b1c1c] hover:text-[#d71920] rounded-lg font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </div>
              <span>Xem Trailer chính thức (Full HD)</span>
            </button>
            <span className="text-[#c8c6c5] text-xs hidden sm:inline">
              Thời lượng trailer: 2 phút 45 giây
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieHero;
