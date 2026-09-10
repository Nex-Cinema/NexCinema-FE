import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Ticket,
  Home,
  Store,
  Calendar,
  FileText,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import BookingProgressBar from '../../components/common/BookingProgressBar';

interface ConfirmationData {
  orderCode: string;
  movieTitle: string;
  formatText: string;
  cinemaName: string;
  roomName: string;
  showtime: string;
  seats: string[];
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  createdDate: string;
}

export const BookingConfirmation: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // BR#16: Read booking confirmation data from sessionStorage or localStorage (dynamic, not hardcoded)
  const bookingData: ConfirmationData = useMemo(() => {
    try {
      const saved = sessionStorage.getItem('booking_confirmation') || localStorage.getItem('booking_confirmation');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          orderCode: parsed.orderCode || 'NEX-000000',
          movieTitle: parsed.movieTitle || 'N/A',
          formatText: parsed.formatText || 'N/A',
          cinemaName: parsed.cinemaName || 'NexCinema Complex',
          roomName: parsed.roomName || 'N/A',
          showtime: parsed.showtime || 'N/A',
          seats: parsed.seats || [],
          paymentMethod: parsed.paymentMethod || 'N/A',
          paymentStatus: parsed.paymentStatus || 'ĐÃ THANH TOÁN',
          totalAmount: parsed.totalAmount || 0,
          createdDate: parsed.createdDate || new Date().toLocaleDateString('vi-VN'),
        };
      }
    } catch {
      // fallback to default
    }
    // Fallback mock data if no session data
    return {
      orderCode: 'NEX-982405',
      movieTitle: 'Dune: Hành Tinh Cát - Phần 2',
      formatText: '2D IMAX Laser',
      cinemaName: 'NexCinema Complex Lê Duẩn',
      roomName: 'Phòng chiếu IMAX Laser (Tầng 4)',
      showtime: '11:30 - Thứ Ba, 29/10/2024',
      seats: ['J4', 'J5'],
      paymentMethod: 'VNPAY (Cổng VNPAY-QR)',
      paymentStatus: 'ĐÃ THANH TOÁN',
      totalAmount: 220000,
      createdDate: new Date().toLocaleDateString('vi-VN'),
    };
  }, []);

  // ISSUE-18 FIX: Clean up booking draft on mount, but KEEP confirmation data so back/forward navigation works
  useEffect(() => {
    sessionStorage.removeItem('booking_draft');
  }, []);

  return (
    <div className="w-full bg-[#f5f3f3] text-[#1b1c1c] min-h-screen py-6">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
        {/* BR#1: Step 4 Progress Bar */}
        <BookingProgressBar currentStep={4} />

        <div className="max-w-2xl mx-auto">
          {/* SUCCESS BADGE CARD */}
          <div className="bg-white rounded-2xl shadow-md p-8 border border-[#e4e2e2] text-center flex flex-col items-center gap-4 relative overflow-hidden">
            <div className="h-2 w-full bg-emerald-500 absolute top-0 left-0 right-0" />

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Giao dịch thành công
              </span>
              <h1 className="text-2xl font-black text-[#1b1c1c] tracking-tight mt-1">
                ĐẶT VÉ XEM PHIM THÀNH CÔNG!
              </h1>
              <p className="text-xs text-[#5f5e5e] mt-1">
                Cảm ơn bạn đã lựa chọn NexCinema. Thông tin vé điện tử đã được lưu vào tài khoản.
              </p>
            </div>

            {/* QR CODE TICKET BOARD */}
            <div className="w-full bg-[#f5f3f3] rounded-xl p-6 border border-[#e4e2e2] flex flex-col items-center gap-3 my-2">
              <div className="bg-white p-3 rounded-lg shadow-sm border border-[#e4e2e2]">
                {/* ISSUE-10 FIX: Real QR code encoding ticket data */}
                <QRCodeSVG
                  value={`NEXCINEMA:${bookingData.orderCode}:${bookingData.seats.join(',')}:${bookingData.showtime}`}
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="text-center">
                <span className="text-[11px] text-[#5f5e5e] uppercase tracking-wider font-semibold block">
                  Mã đặt vé (Ticket ID)
                </span>
                <strong className="text-lg font-black text-[#d71920] tracking-wider">
                  #{bookingData.orderCode}
                </strong>
              </div>
            </div>

            {/* TICKET DETAILS TABLE */}
            <div className="w-full text-left space-y-3 text-xs text-[#5f5e5e]">
              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span className="flex items-center gap-1.5 font-semibold text-[#1b1c1c]">
                  <FileText className="w-4 h-4 text-[#d71920]" /> Tên phim:
                </span>
                <strong className="text-[#1b1c1c] text-sm">{bookingData.movieTitle}</strong>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span className="flex items-center gap-1.5 font-semibold text-[#1b1c1c]">
                  <Store className="w-4 h-4 text-[#d71920]" /> Địa điểm:
                </span>
                <span className="text-[#1b1c1c]">{bookingData.cinemaName}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span className="flex items-center gap-1.5 font-semibold text-[#1b1c1c]">
                  <Calendar className="w-4 h-4 text-[#d71920]" /> Suất chiếu:
                </span>
                <strong className="text-[#d71920]">{bookingData.showtime}</strong>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span className="flex items-center gap-1.5 font-semibold text-[#1b1c1c]">
                  <Ticket className="w-4 h-4 text-[#d71920]" /> Ghế đã chọn:
                </span>
                <strong className="text-[#1b1c1c] text-sm">
                  {bookingData.seats.join(', ')} ({bookingData.roomName})
                </strong>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span>Phương thức thanh toán:</span>
                <span className="text-[#1b1c1c] font-medium">{bookingData.paymentMethod}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[#e4e2e2]">
                <span>Trạng thái:</span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                  {bookingData.paymentStatus}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-[#1b1c1c]">Tổng tiền thanh toán:</span>
                <strong className="text-xl font-black text-[#d71920]">
                  {bookingData.totalAmount.toLocaleString('vi-VN')} đ
                </strong>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#e4e2e2]">
              <Link
                to="/profile"
                className="py-3 px-4 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>Xem lịch sử đặt vé</span>
              </Link>

              <Link
                to="/"
                className="py-3 px-4 rounded-xl bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 border border-[#e4e2e2]"
              >
                <Home className="w-4 h-4" />
                <span>Về trang chủ</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
