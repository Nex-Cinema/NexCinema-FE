import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  Clock,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

import BookingProgressBar from '../../components/common/BookingProgressBar';

import { useSeatSelection } from '@/features/booking/hooks/useSeatSelection';
import { saveBookingDraft } from '@/features/booking/utils/bookingSession';
import {
  MAX_SEATS_PER_BOOKING,
  SEAT_HOLD_DURATION_S,
  AGE_RESTRICTED_RATINGS,
} from '@/features/booking/constants/bookingConstants';
import { Seat, ShowtimePill } from '@/features/booking/types/booking.type';

// ── Mock Data ─────────────────────────────────────────────────────
const SHOWTIME_PILLS: ShowtimePill[] = [
  { id: 'st-10:45', time: '10:45', seatsLeft: 0, isSoldOut: true },
  { id: 'st-11:30', time: '11:30', isCurrent: true, seatsLeft: 42 },
  { id: 'st-13:00', time: '13:00', seatsLeft: 6 }, // Low stock (< 10)
  { id: 'st-13:45', time: '13:45', seatsLeft: 76 },
  { id: 'st-15:15', time: '15:15', seatsLeft: 0, isSoldOut: true },
  { id: 'st-16:00', time: '16:00', seatsLeft: 18 },
  { id: 'st-17:30', time: '17:30', seatsLeft: 4 }, // Low stock (< 10)
  { id: 'st-18:15', time: '18:15', seatsLeft: 52 },
  { id: 'st-19:45', time: '19:45', seatsLeft: 64 },
  { id: 'st-20:30', time: '20:30', seatsLeft: 30 },
];

export const SeatSelection: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  // ── Domain & UI States ────────────────────────────────────────────
  const [currentShowtimeId, setCurrentShowtimeId] = useState(showtimeId || 'st-11:30');
  const [currentShowtimeTime, setCurrentShowtimeTime] = useState('11:30');
  const [isAgeGateOpen, setIsAgeGateOpen] = useState(false);

  // Extract seat selection domain logic
  const {
    selectedSeatIds,
    setSelectedSeatIds,
    totalAmount,
    seatMap,
    rows,
    handleToggleSeat,
  } = useSeatSelection();

  // Mock movie info
  const MOVIE_AGE_RATING = 'C16'; // C16 — Dune 2
  const MOVIE_TITLE = 'Dune: Hành Tinh Cát - Phần 2';

  // Scroll to top when page mounts or showtime changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentShowtimeId]);

  // BR#2: Switch showtime directly from Seat Selection screen → reset seats
  const handleChangeShowtime = (slotId: string, slotTime: string, isSoldOut?: boolean) => {
    if (isSoldOut) {
      toast.error('Suất chiếu này đã hết vé! Vui lòng chọn suất khác.');
      return;
    }
    if (slotId === currentShowtimeId) return;
    setCurrentShowtimeId(slotId);
    setCurrentShowtimeTime(slotTime);
    setSelectedSeatIds([]);
    toast.success(`Đã đổi sang suất chiếu ${slotTime}`);
  };

  // ISSUE-16: Age gate check — trigger modal for rated films before payment
  const handleContinueToPayment = () => {
    if (selectedSeatIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế hợp lệ!');
      return;
    }
    if ((AGE_RESTRICTED_RATINGS as readonly string[]).includes(MOVIE_AGE_RATING)) {
      setIsAgeGateOpen(true);
      return;
    }
    proceedToPayment();
  };

  // Save booking draft using domain session service & navigate
  const proceedToPayment = () => {
    saveBookingDraft({
      movieId: 'dune2',
      movieTitle: MOVIE_TITLE,
      showtimeId: currentShowtimeId,
      showtimeTime: currentShowtimeTime,
      showtimeDate: 'Thứ Ba, 29/10/2024',
      roomName: 'Phòng chiếu IMAX Laser',
      formatText: '2D IMAX Phụ Đề',
      seats: selectedSeatIds,
      totalAmount,
      holdTimeLeft: SEAT_HOLD_DURATION_S,
      holdStartedAt: Date.now(),
    });
    toast.success('Đã chọn ghế thành công! Chuyển sang bước thanh toán...');
    navigate(ROUTES.BOOKING.PAYMENT);
  };

  // ── Seat button style helper ──────────────────────────────────────
  const getSeatButtonClass = (seat: Seat): string => {
    const base = 'flex items-center justify-center text-[11px] font-bold transition-all shadow-2xs';

    if (seat.status === 'SOLD') {
      return `${base} bg-[#e2e8f0] text-slate-400 cursor-not-allowed border border-slate-300`;
    }
    if (seat.status === 'HELD') {
      return `${base} bg-orange-100 text-orange-500 cursor-not-allowed border border-orange-300 opacity-70`;
    }
    if (seat.status === 'SELECTED') {
      return `${base} bg-[#d71920] text-white scale-105 shadow-md ring-2 ring-[#d71920]/40`;
    }
    if (seat.type === 'VIP') {
      return `${base} bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-400 font-bold`;
    }
    if (seat.type === 'COUPLE') {
      return `${base} bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-400 font-bold`;
    }
    return `${base} bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-700 border border-slate-300`;
  };

  return (
    <div className="w-full bg-[#f5f3f3] text-[#1b1c1c] min-h-screen pb-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* ── TOP STEPPER BAR ────────────────────────────────────── */}
        <BookingProgressBar currentStep={2} />

        {/* ── MAIN TWO-COLUMN LAYOUT ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: SEAT MAP & SHOWTIME SWITCHER (~70% = 8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Quick Showtime Selector Ribbon */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-[#e4e2e2]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#d71920]" />
                  <span className="text-xs font-bold text-[#1b1c1c]">Đổi suất chiếu hôm nay</span>
                </div>
                <span className="text-xs text-[#5f5e5e]">29/10/2024</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SHOWTIME_PILLS.map((pill) => {
                  const isCurrent = pill.id === currentShowtimeId;
                  const isLowStock = pill.seatsLeft !== undefined && pill.seatsLeft > 0 && pill.seatsLeft < 10;
                  return (
                    <button
                      key={pill.id}
                      disabled={pill.isSoldOut}
                      onClick={() => handleChangeShowtime(pill.id, pill.time, pill.isSoldOut)}
                      title={pill.isSoldOut ? 'Suất chiếu đã hết vé' : isLowStock ? `Còn ${pill.seatsLeft} ghế` : `Suất chiếu ${pill.time}`}
                      className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        pill.isSoldOut
                          ? 'bg-[#e4e2e2]/70 text-[#8e8c8c] line-through cursor-not-allowed opacity-70 border border-[#e4e2e2]'
                          : isCurrent
                          ? 'bg-[#d71920] text-white shadow-sm ring-2 ring-[#d71920]/30'
                          : isLowStock
                          ? 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
                          : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
                      }`}
                    >
                      <span>{pill.time}</span>
                      {pill.isSoldOut && (
                        <span className="text-[10px] no-underline font-normal text-[#ba1a1a]">
                          (Hết vé)
                        </span>
                      )}
                      {!pill.isSoldOut && isLowStock && (
                        <span className="text-[10px] font-semibold text-amber-700">
                          (Còn {pill.seatsLeft})
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SEAT MAP DISPLAY CARD */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e4e2e2] flex flex-col items-center">
              {/* Screen Frame */}
              <div className="w-full max-w-xl mx-auto mb-8 flex flex-col items-center">
                <div className="w-full h-8 border-t-2 border-[#d71920] rounded-t-[50%] bg-gradient-to-b from-[#d71920]/10 to-transparent flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d71920]">
                    MÀN HÌNH CHIẾU / SCREEN
                  </span>
                </div>
              </div>

              {/* Seat Grid */}
              <div className="w-full overflow-x-auto pb-4 flex justify-center scrollbar-none">
                <div className="flex flex-col gap-2 min-w-[580px]">
                  {rows.map((row) => (
                    <div key={row} className="flex items-center justify-center gap-2">
                      {/* Row Label Left */}
                      <span className="w-6 text-center font-bold text-xs text-[#5f5e5e]">
                        {row}
                      </span>

                      {/* Seats in Row */}
                      <div className="flex items-center gap-1.5">
                        {row === 'K' ? (
                          /* ── COUPLE ROW (Row K: 6 double seats) ────────── */
                          [1, 3, 5, 7, 9, 11].map((c1) => {
                            const c2 = c1 + 1;
                            const isAisleBefore = [3, 11].includes(c1);
                            const seat1 = seatMap['K']?.find((s) => s.col === c1);
                            const seat2 = seatMap['K']?.find((s) => s.col === c2);
                            const isSold = seat1?.status === 'SOLD' || seat2?.status === 'SOLD';
                            const isHeld = seat1?.status === 'HELD' || seat2?.status === 'HELD';
                            const isSelected =
                              seat1?.status === 'SELECTED' || seat2?.status === 'SELECTED';

                            const coupleClass = isSold
                              ? 'bg-[#e2e8f0] text-slate-400 cursor-not-allowed border border-slate-300'
                              : isHeld
                              ? 'bg-orange-100 text-orange-500 cursor-not-allowed border border-orange-300 opacity-70'
                              : isSelected
                              ? 'bg-[#d71920] text-white scale-105 shadow-md ring-2 ring-[#d71920]/40'
                              : 'bg-pink-50 hover:bg-pink-100 text-pink-800 border border-pink-400 font-bold';

                            return (
                              <React.Fragment key={`K${c1}-${c2}`}>
                                {isAisleBefore && <div className="w-4" />}
                                <button
                                  type="button"
                                  onClick={() => seat1 && handleToggleSeat(seat1)}
                                  disabled={isSold || isHeld}
                                  className={`w-[4.6rem] h-8 rounded-t-lg flex items-center justify-center text-[11px] font-bold transition-all shadow-2xs ${coupleClass}`}
                                  title={
                                    isSold
                                      ? `Ghế đôi K${c1}-K${c2} — Đã bán`
                                      : isHeld
                                      ? `Ghế đôi K${c1}-K${c2} — Đang được giữ`
                                      : `Ghế đôi K${c1}-K${c2} - 220.000 đ/cặp`
                                  }
                                >
                                  {isSold ? '✕' : isHeld ? '⏳' : `K${c1}-${c2}`}
                                </button>
                              </React.Fragment>
                            );
                          })
                        ) : (
                          /* ── STANDARD & VIP ROWS (A-I) ─────────────────── */
                          seatMap[row]?.map((seat) => {
                            const isAisleBefore = [3, 11].includes(seat.col);
                            return (
                              <React.Fragment key={seat.id}>
                                {isAisleBefore && <div className="w-4" />}
                                <button
                                  type="button"
                                  onClick={() => handleToggleSeat(seat)}
                                  disabled={seat.status === 'SOLD' || seat.status === 'HELD'}
                                  className={`w-8 h-8 rounded-t-lg ${getSeatButtonClass(seat)}`}
                                  title={
                                    seat.status === 'SOLD'
                                      ? `${seat.id} — Đã bán`
                                      : seat.status === 'HELD'
                                      ? `${seat.id} — Đang được giữ bởi người khác`
                                      : `${seat.id} (${
                                          seat.type === 'VIP' ? 'Ghế VIP' : 'Ghế tiêu chuẩn'
                                        }) - ${seat.price.toLocaleString('vi-VN')} đ`
                                  }
                                >
                                  {seat.status === 'SOLD'
                                    ? '✕'
                                    : seat.status === 'HELD'
                                    ? '⏳'
                                    : seat.col}
                                </button>
                              </React.Fragment>
                            );
                          })
                        )}
                      </div>

                      {/* Row Label Right */}
                      <span className="w-6 text-center font-bold text-xs text-[#5f5e5e]">
                        {row}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Legend */}
              <div className="mt-6 pt-4 border-t border-[#e4e2e2] w-full flex flex-wrap items-center justify-center gap-5 text-xs text-[#5f5e5e]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-[#f1f5f9] border border-slate-300" />
                  <span>Ghế tiêu chuẩn (50.000đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-amber-50 border border-amber-400" />
                  <span className="font-semibold text-amber-900">Ghế VIP (110.000đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-5 rounded-t bg-pink-50 border border-pink-400 flex items-center justify-center text-[9px] font-bold text-pink-800">
                    K1-2
                  </div>
                  <span className="font-semibold text-pink-900">Ghế Đôi (220.000đ/cặp)</span>
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

              {/* Max Selection Notice */}
              <div className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#f5f3f3] rounded-lg text-xs text-[#5f5e5e]">
                <Info className="w-4 h-4 text-[#d71920]" />
                <span>Tối đa được chọn {MAX_SEATS_PER_BOOKING} ghế trong một lần đặt vé</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (~30% = 4 cols) */}
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
                    alt="Dune 2"
                    className="w-14 h-20 rounded object-cover flex-shrink-0 shadow-xs"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#d71920] text-white font-bold text-[10px]">
                        C16
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#e4e2e2] text-[#1b1c1c] font-semibold text-[10px]">
                        2D IMAX Phụ Đề
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#1b1c1c] line-clamp-2 leading-snug">
                      Dune: Hành Tinh Cát - Phần 2
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
                  onClick={handleContinueToPayment}
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
        </div>
      </div>

      {/* ── ISSUE-16: AGE GATE CONFIRMATION MODAL ─────────────────────────────── */}
      {isAgeGateOpen && (
        <div
          onClick={() => setIsAgeGateOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in duration-150 border border-gray-200"
          >
            {/* Rating badge */}
            <div className="flex items-center justify-center mb-4">
              <span
                className={`px-4 py-2 rounded-xl font-black text-2xl shadow-sm ${
                  MOVIE_AGE_RATING === 'C18'
                    ? 'bg-red-600 text-white'
                    : MOVIE_AGE_RATING === 'C16'
                    ? 'bg-amber-500 text-gray-900'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {MOVIE_AGE_RATING}
              </span>
            </div>

            <h3 className="text-base font-bold text-[#1b1c1c]">Xác nhận độ tuổi</h3>
            <p className="text-xs text-[#5f5e5e] mt-2 leading-relaxed">
              Phim{' '}
              <span className="font-bold text-[#1b1c1c]">"{MOVIE_TITLE}"</span> được xếp hạng{' '}
              <span className="font-black text-[#d71920]">{MOVIE_AGE_RATING}</span>.
              {MOVIE_AGE_RATING === 'C18'
                ? ' Chỉ dành cho khán giả từ 18 tuổi trở lên.'
                : MOVIE_AGE_RATING === 'C16'
                ? ' Chỉ dành cho khán giả từ 16 tuổi trở lên.'
                : ' Chỉ dành cho khán giả từ 13 tuổi trở lên.'}
            </p>
            <p className="text-[11px] text-gray-400 mt-2 italic">
              Nhân viên rạp có thể yêu cầu xuất trình CCCD / Căn cước / Hộ chiếu tại cổng soát vé.
            </p>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={() => setIsAgeGateOpen(false)}
                className="py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  setIsAgeGateOpen(false);
                  proceedToPayment();
                }}
                className="py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Tôi đủ tuổi, tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;
