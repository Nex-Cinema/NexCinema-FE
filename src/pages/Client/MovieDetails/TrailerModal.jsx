import { X } from 'lucide-react';

/**
 * TrailerModal — full-screen YouTube embed overlay.
 * Pure presentational.
 */
const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="fixed inset-0 z-10000 flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative aspect-video max-h-[calc(100dvh-2rem)] w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_60px_rgba(255,67,110,0.2)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2.5 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors cursor-pointer group"
        >
          <X size={22} className="group-hover:scale-110 transition-transform" />
        </button>
        <iframe
          className="w-full h-full"
          src={trailerUrl}
          title="Trình phát Trailer Phim"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default TrailerModal;
