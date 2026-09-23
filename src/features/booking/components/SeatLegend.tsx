import React from 'react';
import {
  PRICE_STANDARD,
  PRICE_VIP,
  PRICE_COUPLE,
} from '../constants/bookingConstants';

export interface SeatLegendProps {
  className?: string;
}

export const SeatLegend: React.FC<SeatLegendProps> = ({ className = '' }) => {
  return (
    <div
      className={`mt-6 pt-4 border-t border-[#e4e2e2] w-full flex flex-wrap items-center justify-center gap-5 text-xs text-[#5f5e5e] ${className}`}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-[#f1f5f9] border border-slate-300" />
        <span>Ghế tiêu chuẩn ({PRICE_STANDARD.toLocaleString('vi-VN')}đ)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-amber-50 border border-amber-400" />
        <span className="font-semibold text-amber-900">
          Ghế VIP ({PRICE_VIP.toLocaleString('vi-VN')}đ)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-8 h-5 rounded-t bg-pink-50 border border-pink-400 flex items-center justify-center text-[9px] font-bold text-pink-800">
          K1-2
        </div>
        <span className="font-semibold text-pink-900">
          Ghế Đôi ({(PRICE_COUPLE * 2).toLocaleString('vi-VN')}đ/cặp)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-[#d71920]" />
        <span className="font-bold text-[#1b1c1c]">Đang chọn</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-orange-100 border border-orange-300 flex items-center justify-center text-[10px] text-orange-500">
          ⏳
        </div>
        <span className="text-orange-700">Đang giữ</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-t bg-[#e2e8f0] text-slate-400 flex items-center justify-center text-[10px]">
          ✕
        </div>
        <span>Đã bán</span>
      </div>
    </div>
  );
};

export default SeatLegend;
