import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { Clock } from 'lucide-react';
import toast from 'react-hot-toast';

import BookingProgressBar from '@/features/booking/components/BookingProgressBar';
import ShowtimePill from '@/components/shared/ShowtimePill';
import SeatMapGrid from '@/features/booking/components/SeatMapGrid';
import BookingSummarySidebar from '@/features/booking/components/BookingSummarySidebar';
import AgeGateModal from '@/features/booking/components/AgeGateModal';

import { useSeatSelection } from '@/features/booking/hooks/useSeatSelection';
import { saveBookingDraft } from '@/features/booking/utils/bookingSession';
import {
  MAX_SEATS_PER_BOOKING,
  SEAT_HOLD_DURATION_S,
  AGE_RESTRICTED_RATINGS,
} from '@/features/booking/constants/bookingConstants';
import { Seat, ShowtimePill as ShowtimePillType } from '@/features/booking/types/booking.type';

// ── Mock Data ─────────────────────────────────────────────────────
const SHOWTIME_PILLS: ShowtimePillType[] = [
  { id: 'st-10:45', time: '10:45', seatsLeft: 0, isSoldOut: true },
  { id: 'st-11:30', time: '11:30', isCurrent: true, seatsLeft: 42 },
  { id: 'st-13:00', time: '13:00', seatsLeft: 6 },
  { id: 'st-13:45', time: '13:45', seatsLeft: 76 },
  { id: 'st-15:15', time: '15:15', seatsLeft: 0, isSoldOut: true },
  { id: 'st-16:00', time: '16:00', seatsLeft: 18 },
  { id: 'st-17:30', time: '17:30', seatsLeft: 4 },
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
      return `${base} bg-[#d71920] text-[#ffffff] scale-105 shadow-md ring-2 ring-[#d71920]/40`;
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
                {SHOWTIME_PILLS.map((pill) => (
                  <ShowtimePill
                    key={pill.id}
                    id={pill.id}
                    time={pill.time}
                    seatsLeft={pill.seatsLeft}
                    isSoldOut={pill.isSoldOut}
                    isSelected={pill.id === currentShowtimeId}
                    onClick={() => handleChangeShowtime(pill.id, pill.time, pill.isSoldOut)}
                  />
                ))}
              </div>
            </div>

            {/* SEAT MAP DISPLAY CARD */}
            <SeatMapGrid
              rows={rows}
              seatMap={seatMap}
              onToggleSeat={handleToggleSeat}
              getSeatButtonClass={getSeatButtonClass}
              maxSeatsPerBooking={MAX_SEATS_PER_BOOKING}
            />
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (~30% = 4 cols) */}
          <BookingSummarySidebar
            movieTitle={MOVIE_TITLE}
            movieAgeRating={MOVIE_AGE_RATING}
            currentShowtimeTime={currentShowtimeTime}
            selectedSeatIds={selectedSeatIds}
            totalAmount={totalAmount}
            onContinueToPayment={handleContinueToPayment}
          />
        </div>
      </div>

      {/* ── ISSUE-16: AGE GATE CONFIRMATION MODAL ─────────────────────────────── */}
      <AgeGateModal
        isOpen={isAgeGateOpen}
        onClose={() => setIsAgeGateOpen(false)}
        movieTitle={MOVIE_TITLE}
        movieAgeRating={MOVIE_AGE_RATING}
        onConfirm={proceedToPayment}
      />
    </div>
  );
};

export default SeatSelection;
