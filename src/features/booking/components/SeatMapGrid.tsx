import React from 'react';
import { Info } from 'lucide-react';
import SeatLegend from './SeatLegend';
import { Seat } from '../types/booking.type';

interface SeatMapGridProps {
  rows: string[];
  seatMap: Record<string, Seat[]>;
  onToggleSeat: (seat: Seat) => void;
  getSeatButtonClass: (seat: Seat) => string;
  maxSeatsPerBooking: number;
}

export const SeatMapGrid: React.FC<SeatMapGridProps> = ({
  rows,
  seatMap,
  onToggleSeat,
  getSeatButtonClass,
  maxSeatsPerBooking,
}) => {
  return (
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
                          onClick={() => seat1 && onToggleSeat(seat1)}
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
                          onClick={() => onToggleSeat(seat)}
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

      {/* Extracted Seat Legend Component */}
      <SeatLegend />

      {/* Max Selection Notice */}
      <div className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-[#f5f3f3] rounded-lg text-xs text-[#5f5e5e]">
        <Info className="w-4 h-4 text-[#d71920]" />
        <span>Tối đa được chọn {maxSeatsPerBooking} ghế trong một lần đặt vé</span>
      </div>
    </div>
  );
};

export default SeatMapGrid;
