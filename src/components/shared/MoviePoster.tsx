import React from 'react';

export interface MoviePosterProps {
  src: string;
  alt: string;
  aspectRatio?: string;
  className?: string;
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';

export const MoviePoster: React.FC<MoviePosterProps> = ({
  src,
  alt,
  aspectRatio = 'aspect-[2/3]',
  className = '',
  fallbackSrc = DEFAULT_FALLBACK,
}) => {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = fallbackSrc;
  };

  return (
    <div className={`relative w-full overflow-hidden bg-gray-100 ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        onError={handleError}
        className="w-full h-full object-cover transition-transform duration-500"
      />
    </div>
  );
};

export default MoviePoster;
