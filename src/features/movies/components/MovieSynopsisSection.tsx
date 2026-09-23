import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface MovieSynopsisSectionProps {
  synopsis: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const MovieSynopsisSection: React.FC<MovieSynopsisSectionProps> = ({
  synopsis,
  isExpanded,
  onToggleExpand,
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-3">
      <h2 className="text-lg font-bold text-[#1b1c1c]">NỘI DUNG PHIM</h2>
      <div className="relative">
        <p
          className={`text-sm text-[#5f5e5e] leading-relaxed transition-all duration-300 ${
            isExpanded ? '' : 'line-clamp-3'
          }`}
        >
          {synopsis}
        </p>
        <button
          onClick={onToggleExpand}
          className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#d71920] hover:underline cursor-pointer"
        >
          <span>{isExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default MovieSynopsisSection;
