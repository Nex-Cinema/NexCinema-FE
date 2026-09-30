import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const TrailerModal = ({ embedUrl, onClose }) => {
  useEffect(() => {
    if (!embedUrl) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [embedUrl, onClose]);

  if (!embedUrl || typeof document === 'undefined') return null;

  return createPortal(
    <div className="client-trailer-layer" role="dialog" aria-modal="true" aria-label="Trailer phim">
      <button type="button" className="client-trailer-backdrop" onClick={onClose} aria-label="Đóng trailer" />
      <div className="client-trailer-dialog">
        <button type="button" onClick={onClose} className="client-trailer-close" aria-label="Đóng trailer" title="Đóng trailer">
          <X size={21} strokeWidth={1.8} />
        </button>
        <div className="client-trailer-frame">
          <iframe src={embedUrl} title="Trailer phim" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TrailerModal;
