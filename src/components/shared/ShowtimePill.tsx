import React from 'react';

export interface ShowtimePillProps {
  id: string;
  time: string;
  seatsLeft?: number;
  isHot?: boolean;
  isSoldOut?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ShowtimePill: React.FC<ShowtimePillProps> = ({
  time,
  seatsLeft,
  isHot = false,
  isSoldOut = false,
  isSelected = false,
  onClick,
  className = '',
}) => {
  const isLowStock = seatsLeft !== undefined && seatsLeft > 0 && seatsLeft < 10;

  if (isSoldOut) {
    return (
      <button
        type="button"
        disabled
        className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap bg-[#e4e2e2]/70 text-[#8e8c8c] line-through cursor-not-allowed opacity-70 border border-[#e4e2e2] flex items-center gap-1.5 ${className}`}
        title="Suất chiếu đã hết vé"
      >
        <span>{time}</span>
        <span className="text-[10px] no-underline font-normal text-[#ba1a1a]">(Hết vé)</span>
      </button>
    );
  }

  if (isSelected) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap bg-[#d71920] text-white shadow-sm ring-2 ring-[#d71920]/30 transition-all flex items-center gap-1.5 cursor-pointer ${className}`}
      >
        <span>{time}</span>
        {seatsLeft !== undefined && (
          <span className="text-[10px] font-semibold text-white/90">
            ({seatsLeft} ghế)
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={isLowStock ? `Còn ${seatsLeft} ghế` : `Suất chiếu ${time}`}
      className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
        isHot || isLowStock
          ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
          : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
      } ${className}`}
    >
      <span>{time}</span>
      {isLowStock && (
        <span className="text-[10px] font-semibold text-amber-700">
          (Còn {seatsLeft})
        </span>
      )}
      {!isLowStock && isHot && (
        <span className="text-[10px] font-semibold text-amber-700">(Hot)</span>
      )}
    </button>
  );
};

export default ShowtimePill;
