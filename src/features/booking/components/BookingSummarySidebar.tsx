import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Clock, ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { ROUTES } from '@/constants';
import AgeBadge from '@/components/shared/AgeBadge';

interface BookingSummarySidebarProps {
  movieTitle: string;
  movieAgeRating: string;
  currentShowtimeTime: string;
  selectedSeatIds: string[];
  totalAmount: number;
  onContinueToPayment: () => void;
}

export const BookingSummarySidebar: React.FC<BookingSummarySidebarProps> = ({
  movieTitle,
  movieAgeRating,
  currentShowtimeTime,
  selectedSeatIds,
  totalAmount,
  onContinueToPayment,
}) => {
  return (
    <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e4e2e2]">
        {/* Top Red Accent Bar */}
        <div className="h-1.5 w-full bg-[#d71920]" />

        <div className="p-6 flex flex-col gap-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-[#1b1c1c] uppercase tracking-wide">
              Thông tin đặt vé
            </h2>
            <span className="text-[10px] text-[#5f5e5e] font-medium border border-dashed border-gray-300 px-2 py-0.5 rounded-full">
              Bước 2 / 4
            </span>
          </div>

          {/* Movie Brief Card */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f5f3f3]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw"
              alt={movieTitle}
              className="w-14 h-20 rounded object-cover flex-shrink-0 shadow-xs"
            />
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 mb-1">
                <AgeBadge rating={movieAgeRating} />
                <span className="px-1.5 py-0.5 rounded bg-[#e4e2e2] text-[#1b1c1c] font-semibold text-[10px]">
                  2D IMAX Phụ Đề
                </span>
              </div>
              <h3 className="font-bold text-sm text-[#1b1c1c] line-clamp-2 leading-snug">
                {movieTitle}
              </h3>
              <p className="text-[11px] text-[#5f5e5e] mt-1">Khoa học viễn tưởng, Phiêu lưu</p>
            </div>
          </div>

          {/* Cinema & Showtime Info */}
          <div className="space-y-2 text-xs text-[#5f5e5e]">
            <div className="flex items-start gap-2">
              <Ticket className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1b1c1c]">NexCinema Complex Lê Duẩn</p>
                <p className="text-[11px]">Phòng chiếu IMAX Laser</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1b1c1c]">
                  {currentShowtimeTime} - Thứ Ba, 29/10/2024
                </p>
              </div>
            </div>
          </div>

          {/* Selected Seats Itemized */}
          <div className="pt-3 border-t border-[#e4e2e2]">
            {selectedSeatIds.length > 0 ? (
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#1b1c1c]">
                    {selectedSeatIds.length}x Ghế ({selectedSeatIds.join(', ')})
                  </span>
                  <p className="text-[11px] text-[#5f5e5e]">Vị trí ghế đã chọn</p>
                </div>
                <span className="font-bold text-sm text-[#1b1c1c]">
                  {totalAmount.toLocaleString('vi-VN')} đ
                </span>
              </div>
            ) : (
              <p className="text-xs text-[#5f5e5e] italic">Chưa chọn ghế nào</p>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#e4e2e2]" />

          {/* Price Total */}
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[#5f5e5e] font-semibold">Tổng cộng:</span>
            <span className="text-2xl font-black text-[#d71920]">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {/* ── CTA Button ── */}
          <button
            onClick={onContinueToPayment}
            disabled={selectedSeatIds.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              selectedSeatIds.length > 0
                ? 'bg-[#d71920] hover:bg-[#ae0011] text-white shadow-md active:scale-[0.98] cursor-pointer'
                : 'bg-[#e4e2e2] text-[#5f5e5e] cursor-not-allowed'
            }`}
          >
            <span>TIẾP TỤC THANH TOÁN</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Back to Showtime Link */}
          <Link
            to={ROUTES.BOOKING.CHECKOUT}
            className="text-center text-xs font-semibold text-[#5f5e5e] hover:text-[#d71920] transition-colors flex items-center justify-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại chọn suất chiếu</span>
          </Link>
        </div>
      </div>

      {/* Hold Notice Banner */}
      <div className="bg-[#f5f3f3] rounded-xl p-4 flex items-center gap-3 border border-[#e4e2e2]">
        <Info className="w-5 h-5 text-[#d71920] shrink-0" />
        <div className="text-xs">
          <p className="font-bold text-[#1b1c1c]">Giữ ghế theo thời gian thực</p>
          <p className="text-[#5f5e5e]">
            Hệ thống tự động bảo lưu ghế 10 phút sau khi bạn xác nhận chọn ghế
          </p>
        </div>
      </div>
    </aside>
  );
};

export default BookingSummarySidebar;
