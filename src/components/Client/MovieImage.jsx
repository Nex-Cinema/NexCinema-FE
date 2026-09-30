import { useState } from 'react';
import { Film } from 'lucide-react';
import { getMovieVisuals } from '../../utils/visualHelper';

const MovieImage = ({ movie, src, variant = 'poster', alt, className = '' }) => {
  const [failedSrc, setFailedSrc] = useState('');
  const visuals = getMovieVisuals(movie);
  const fallbackSrc = visuals[variant] || visuals.poster;
  const primarySrc = src || movie?.HinhAnh || movie?.poster_path || fallbackSrc;
  const resolvedSrc = primarySrc && failedSrc !== primarySrc
    ? primarySrc
    : fallbackSrc && failedSrc !== fallbackSrc
      ? fallbackSrc
      : '';

  if (!resolvedSrc) {
    return (
      <span className={`client-movie-image-fallback ${className}`} role="img" aria-label={alt || 'Ảnh phim đang cập nhật'}>
        <Film size={18} strokeWidth={1.7} aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt || ''}
      className={className}
      onError={() => setFailedSrc(resolvedSrc)}
    />
  );
};

export default MovieImage;
