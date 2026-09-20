import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatVND } from '../../../utils/formatHelper';

/**
 * Helper: format a GioChieu ISO-string or "HH:mm:ss" to "HH:mm".
 * Kept local since it is only used here and in the container.
 */
export const formatTime = (isoString) => {
  if (!isoString) return '00:00';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * ShowtimeSelector — date strip + time-slot grid + "Đặt vé" action button.
 * Pure presentational. Receives all showtime data and callbacks via props.
 *
 * Props:
 *  realDates         – [{ id, dayName, dateNum }]
 *  selectedDateId    – currently selected date string
 *  onSelectDate      – (dateId) => void
 *  availableSlots    – showtime slots for the selected date
 *  selectedSlotIndex – index of the currently selected slot
 *  onSelectSlot      – (index) => void
 *  hasShowtimes      – boolean: any showtimes exist at all
 *  onBook            – () => void  (triggers booking flow)
 */
const ShowtimeSelector = ({
  realDates,
  selectedDateId,
  onSelectDate,
  availableSlots,
  selectedSlotIndex,
  onSelectSlot,
  hasShowtimes,
  onBook,
}) => {
  return (
    <section className="flex w-full flex-col gap-8 rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm md:p-8">

      {/* ── Date strip ──────────────────────────────────── */}
      <div className="flex flex-col gap-4 w-full">
        <p className="text-sm font-bold uppercase tracking-wider text-neutral-700">Chọn ngày chiếu</p>
        <div className="flex items-center gap-4">
          <button className="text-neutral-400 transition-colors hover:text-neutral-900" aria-label="Ngày trước">
            <ChevronLeft size={24} />
          </button>
          <div className="flex gap-3 overflow-x-auto scrollbar-none py-1">
            {realDates.map((d) => {
              const isSelected = d.id === selectedDateId;
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDate(d.id)}
                  className={`flex flex-col items-center justify-center w-14 h-16 rounded-xl border transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-(--client-primary) border-(--client-primary) text-white font-bold shadow-sm'
                      : 'border-neutral-200 bg-white text-neutral-500 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-70">{d.dayName}</span>
                  <span className="text-lg font-bold">{d.dateNum}</span>
                </button>
              );
            })}
            {realDates.length === 0 && (
              <p className="py-2 text-sm italic text-neutral-500">
                Hiện tại không có suất chiếu nào khả dụng cho phim này.
              </p>
            )}
          </div>
          <button className="text-neutral-400 transition-colors hover:text-neutral-900" aria-label="Ngày sau">
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* ── Time-slot grid ───────────────────────────────── */}
      {realDates.length > 0 && (
        <div className="flex w-full flex-col gap-4 border-t border-neutral-200 pt-6">
          <p className="text-sm font-bold uppercase tracking-wider text-neutral-700">
            Chọn Suất Chiếu &amp; Phòng Chiếu
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {availableSlots.map((slot, index) => {
              const isSelected = index === selectedSlotIndex;
              return (
                <button
                  key={slot.showId || index}
                  onClick={() => onSelectSlot(index)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-(--client-primary) border-(--client-primary) text-white shadow-sm'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-red-300 hover:bg-red-50'
                  }`}
                >
                  <span className="text-lg font-black tracking-wider">{formatTime(slot.time)}</span>
                  <span className="text-[10px] uppercase opacity-80 mt-1 font-bold">
                    {slot.PhongChieu?.TenPhong || 'Phòng chiếu'}
                  </span>
                  <span className={`mt-0.5 text-xs font-semibold ${isSelected ? 'text-red-100' : 'text-emerald-600'}`}>
                    {formatVND(slot.GiaVeGoc)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {realDates.length === 0 && (
        <div className="w-full text-center py-4">
          <p className="text-sm italic text-neutral-500">Hiện chưa có suất chiếu cho phim này.</p>
        </div>
      )}

      {realDates.length > 0 && (
        <p className="mt-1 text-xs italic text-neutral-500">
          * Giá vé gốc hiển thị trên suất chiếu. Giá ghế cuối cùng đã bao gồm phụ thu loại ghế, phòng chiếu và ngày chiếu.
        </p>
      )}

      {/* ── Book button ─────────────────────────────────── */}
      <div className="flex w-full justify-end border-t border-neutral-200 pt-6">
        <button
          disabled={!hasShowtimes}
          onClick={onBook}
          className="client-primary-button w-full px-12 py-4 text-base md:w-auto"
        >
          {hasShowtimes ? 'ĐẶT VÉ NGAY' : 'CHƯA CÓ SUẤT CHIẾU'}
        </button>
      </div>
    </section>
  );
};

export default ShowtimeSelector;
