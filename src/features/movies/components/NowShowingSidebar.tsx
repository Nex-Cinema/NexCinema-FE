import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Ticket, ChevronRight } from 'lucide-react';
import { ROUTES } from '@/constants';
import { SidebarMovie } from '../types/movieDetails.type';

interface NowShowingSidebarProps {
  sidebarMovies: SidebarMovie[];
  onNavigateToMovie: (movieId: string) => void;
}

export const NowShowingSidebar: React.FC<NowShowingSidebarProps> = ({
  sidebarMovies,
  onNavigateToMovie,
}) => {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e2e2]">
          <h2 className="font-extrabold text-base text-[#1b1c1c] tracking-tight">
            PHIM ĐANG CHIẾU
          </h2>
          <Film className="w-5 h-5 text-[#d71920]" />
        </div>

        <div className="flex flex-col gap-4">
          {sidebarMovies.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigateToMovie(item.id)}
              className="group flex flex-col gap-2 cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl bg-[#efeded] shadow-sm aspect-[4/3]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3">
                  <button className="bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Đặt vé</span>
                  </button>
                </div>
              </div>
              <h4 className="font-semibold text-xs text-[#1b1c1c] group-hover:text-[#d71920] transition-colors truncate">
                {item.title}
              </h4>
            </div>
          ))}
        </div>

        {/* More Movies Link */}
        <Link
          to={ROUTES.MOVIES.NOW_SHOWING}
          className="mt-2 pt-3 border-t border-[#e4e2e2] text-center text-xs font-bold text-[#d71920] hover:text-[#ae0011] transition-colors flex items-center justify-center gap-1"
        >
          <span>XEM THÊM PHIM ĐANG CHIẾU</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </aside>
  );
};

export default NowShowingSidebar;
