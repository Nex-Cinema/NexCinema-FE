import React from 'react';
import { Movie } from '@/types/movie.type';

export type AgeRating = Movie['ageRating'] | 'P' | 'K' | 'C13' | 'C16' | 'C18';

export interface AgeBadgeProps {
  rating: AgeRating;
  showTooltip?: boolean;
  className?: string;
}

const AGE_LABELS: Record<string, string> = {
  P: 'P — Phổ biến: Phù hợp mọi lứa tuổi',
  K: 'K — Trẻ em: Dưới 13 tuổi cần có sự đồng hành của người lớn',
  C13: 'C13 — Từ 13 tuổi trở lên',
  C16: 'C16 — Từ 16 tuổi trở lên',
  C18: 'C18 — Từ 18 tuổi trở lên',
};

const AGE_CLASSES: Record<string, string> = {
  P: 'bg-emerald-600 text-white',
  K: 'bg-emerald-500 text-white',
  C13: 'bg-blue-600 text-white',
  C16: 'bg-amber-500 text-gray-900 ring-1 ring-amber-600',
  C18: 'bg-red-600 text-white ring-1 ring-red-800',
};

export const AgeBadge: React.FC<AgeBadgeProps> = ({
  rating,
  showTooltip = true,
  className = '',
}) => {
  const badgeClass = AGE_CLASSES[rating] || 'bg-gray-800 text-white';
  const label = AGE_LABELS[rating] || `${rating} — Giới hạn độ tuổi`;

  return (
    <span
      className={`px-2 py-0.5 rounded font-black text-[11px] shadow-sm tracking-wide ${badgeClass} ${className}`}
      title={showTooltip ? label : undefined}
      aria-label={label}
    >
      {rating}
    </span>
  );
};

export default AgeBadge;
