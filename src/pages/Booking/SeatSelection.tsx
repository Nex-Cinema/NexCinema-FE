import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Check,
  Clock,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Info,
  Timer,
} from 'lucide-react';
import toast from 'react-hot-toast';

import BookingProgressBar from '../../components/common/BookingProgressBar';

interface Seat {
  id: string; // e.g., "A1", "J4"
  row: string; // e.g., "A", "J"
  col: number; // e.g., 1, 4
  type: 'STANDARD' | 'VIP' | 'COUPLE';
  price: number;
  status: 'AVAILABLE' | 'SELECTED' | 'SOLD';
}

const SHOWTIME_PILLS = [
  { id: 'st-10:45', time: '10:45' },
  { id: 'st-11:30', time: '11:30', isCurrent: true },
  { id: 'st-13:00', time: '13:00' },
  { id: 'st-13:45', time: '13:45' },
  { id: 'st-15:15', time: '15:15' },
  { id: 'st-16:00', time: '16:00' },
  { id: 'st-17:30', time: '17:30' },
  { id: 'st-18:15', time: '18:15' },
  { id: 'st-19:45', time: '19:45' },
  { id: 'st-20:30', time: '20:30' },
];

export const SeatSelection: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();

  // ── States ────────────────────────────────────────────────────────
  const [currentShowtimeId, setCurrentShowtimeId] = useState(showtimeId || 'st-11:30');
  const [currentShowtimeTime, setCurrentShowtimeTime] = useState('11:30');
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes hold timer (600s)

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentShowtimeId]);

  // ── 10-Minute Hold Timer Countdown (Activates only when seats are selected) ──
  useEffect(() => {
    if (selectedSeatIds.length === 0) {
      setTimeLeft(600); // Reset to 10:00 when no seats selected
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          toast.error('Hết thời gian giữ ghế! Hệ thống đã giải phóng vị trí ghế.');
          setSelectedSeatIds([]);
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedSeatIds.length]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ── Generate Seat Map (Rows A-J, Cols 1-12) ───────────────────────
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const generateSeats = (): Record<string, Seat[]> => {
    const map: Record<string, Seat[]> = {};
    // Sold seats mock list
    const soldSeats = ['C4', 'C5', 'E8', 'F2', 'F3'];

    rows.forEach((row) => {
      map[row] = [];
      const isVipRow = ['G', 'H', 'I', 'J'].includes(row);
      const price = isVipRow ? 110000 : 50000;
      const type = isVipRow ? 'VIP' : 'STANDARD';

      for (let col = 1; col <= 12; col++) {
        const id = `${row}${col}`;
        const isSold = soldSeats.includes(id);
        const isSelected = selectedSeatIds.includes(id);

        map[row].push({
          id,
          row,
          col,
          type,
          price,
          status: isSold ? 'SOLD' : isSelected ? 'SELECTED' : 'AVAILABLE',
        });
      }
    });
    return map;
  };

  const seatMap = generateSeats();

  // ── Actions ───────────────────────────────────────────────────────
  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'SOLD') return;

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 8) {
        toast.error('Tối đa chỉ được chọn 8 ghế trong một lần đặt vé!');
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  // Switch showtime directly from Seat Selection screen (Rule 2)
  const handleChangeShowtime = (slotId: string, slotTime: string) => {
    if (slotId === currentShowtimeId) return;
    setCurrentShowtimeId(slotId);
    setCurrentShowtimeTime(slotTime);
    setSelectedSeatIds([]); // Reset selected seats when switching showtime
    toast.success(`Đã đổi sang suất chiếu ${slotTime}`);
  };

  // Total price calculation
  const totalAmount = selectedSeatIds.reduce((sum, seatId) => {
    const row = seatId.charAt(0);
    const isVip = ['G', 'H', 'I', 'J'].includes(row);
    return sum + (isVip ? 110000 : 50000);
  }, 0);

  const handleContinueToPayment = () => {
    if (selectedSeatIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ghế hợp lệ!');
      return;
    }
    // Save selection to state or sessionStorage and navigate to Payment Step 3
    sessionStorage.setItem(
      'booking_draft',
      JSON.stringify({
        movieId: 'dune2',
        movieTitle: 'Dune: Hành Tinh Cát - Phần 2',
        showtimeId: currentShowtimeId,
        showtimeTime: currentShowtimeTime,
        showtimeDate: 'Thứ Ba, 29/10/2024',
        roomName: 'Phòng chiếu IMAX Laser',
        formatText: '2D IMAX Phụ Đề',
        seats: selectedSeatIds,
        totalAmount,
      })
    );
    navigate('/checkout/payment');
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
                  return (
                    <button
                      key={pill.id}
                      onClick={() => handleChangeShowtime(pill.id, pill.time)}
                      className={`px-4 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-colors ${
                        isCurrent
                          ? 'bg-[#d71920] text-white shadow-sm'
                          : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
                      }`}
                    >
                      {pill.time}
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
                        {seatMap[row].map((seat) => {
                          const isAisleBefore = [3, 11].includes(seat.col);
                          return (
                            <React.Fragment key={seat.id}>
                              {isAisleBefore && <div className="w-4" />}
                              <button
                                onClick={() => handleToggleSeat(seat)}
                                disabled={seat.status === 'SOLD'}
                                className={`w-8 h-8 rounded-t-lg flex items-center justify-center text-[11px] font-bold transition-all shadow-2xs ${
                                  seat.status === 'SOLD'
                                    ? 'bg-[#e4e2e2] text-[#926f6b] cursor-not-allowed border border-[#e6bdb8]'
                                    : seat.status === 'SELECTED'
                                    ? 'bg-[#d71920] text-white scale-105 shadow-md ring-2 ring-[#d71920]/40'
                                    : seat.type === 'VIP'
                                    ? 'bg-[#efeded] hover:bg-[#e2dfde] text-[#1b1c1c] border border-[#c8c6c5]'
                                    : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] border border-[#e4e2e2]'
                                }`}
                                title={`${seat.id} (${
                                  seat.type === 'VIP' ? 'Ghế VIP' : 'Ghế tiêu chuẩn'
                                }) - ${seat.price.toLocaleString('vi-VN')} đ`}
                              >
                                {seat.status === 'SOLD' ? '✕' : seat.col}
                              </button>
                            </React.Fragment>
                          );
                        })}
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
              <div className="mt-6 pt-4 border-t border-[#e4e2e2] w-full flex flex-wrap items-center justify-center gap-6 text-xs text-[#5f5e5e]">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-[#f5f3f3] border border-[#e4e2e2]" />
                  <span>Ghế tiêu chuẩn (50.000đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-[#efeded] border border-[#c8c6c5]" />
                  <span>Ghế VIP (110.000đ)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-[#d71920]" />
                  <span className="font-bold text-[#1b1c1c]">Đang chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-t bg-[#e4e2e2] text-[#926f6b] flex items-center justify-center text-[10px]">
                    ✕
                  </div>
                  <span>Đã bán</span>
                </div>
              </div>

              {/* Max Selection Notice */}
              <div className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#f5f3f3] rounded-lg text-xs text-[#5f5e5e]">
                <Info className="w-4 h-4 text-[#d71920]" />
                <span>Tối đa được chọn 8 ghế trong một lần đặt vé</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (~30% = 4 cols) */}
          <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e4e2e2]">
              {/* Top Red Accent Bar */}
              <div className="h-1.5 w-full bg-[#d71920]" />

              <div className="p-6 flex flex-col gap-5">
                {/* Header & Timer Badge */}
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-base text-[#1b1c1c] uppercase tracking-wide">
                    Thông tin đặt vé
                  </h2>
                  {selectedSeatIds.length > 0 ? (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-[#d71920] font-extrabold text-xs border border-red-200 animate-pulse">
                      <Timer className="w-4 h-4" />
                      <span>{formatTimer(timeLeft)}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-400 font-bold text-xs border border-gray-200" title="Thời gian giữ ghế 10 phút sẽ đếm ngược khi chọn ghế">
                      <Timer className="w-4 h-4 text-gray-400" />
                      <span>10:00</span>
                    </div>
                  )}
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

                {/* Submit CTA Button */}
                <button
                  onClick={handleContinueToPayment}
                  disabled={selectedSeatIds.length === 0}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
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
                  to="/checkout"
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
                <p className="text-[#5f5e5e]">Hệ thống tự động bảo lưu ghế 10 phút sau khi chọn</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
