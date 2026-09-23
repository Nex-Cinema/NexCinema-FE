import React from 'react';
import { Play, X } from 'lucide-react';

interface MovieTrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  trailerUrl: string;
}

export const MovieTrailerModal: React.FC<MovieTrailerModalProps> = ({
  isOpen,
  onClose,
  title,
  trailerUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#1b1c1c] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1b1c1c] border-b border-white/10 text-white">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-[#d71920] fill-[#d71920]" />
            <span className="font-bold text-xs sm:text-sm">
              {title} (Trailer Chính Thức)
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <iframe
            src={trailerUrl}
            title={`${title} Trailer`}
            className="w-full h-full border-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default MovieTrailerModal;
