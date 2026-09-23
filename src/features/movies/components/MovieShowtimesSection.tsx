import React from 'react';
import { Calendar, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import {
  DateTabItem,
  RoomShowtimeGroup,
  ShowtimeSlot,
  SelectedShowtime,
} from '../types/movieDetails.type';

interface MovieShowtimesSectionProps {
  datesList: DateTabItem[];
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  roomGroups: RoomShowtimeGroup[];
  selectedShowtime: SelectedShowtime | null;
  onSelectSlot: (slot: ShowtimeSlot, group: RoomShowtimeGroup) => void;
  onContinueToSeatSelection: () => void;
}

export const MovieShowtimesSection: React.FC<MovieShowtimesSectionProps> = ({
  datesList,
  selectedDate,
  onSelectDate,
  roomGroups,
  selectedShowtime,
  onSelectSlot,
  onContinueToSeatSelection,
}) => {
  return (
    <section
      id="lich-chieu-section"
      className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-6 scroll-mt-24"
    >
      {/* Section Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-[#d71920]" />
          <h2 className="text-xl font-extrabold text-[#1b1c1c]">LỊCH CHIẾU</h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#5f5e5e]">
          <MapPin className="w-4 h-4 text-[#d71920] shrink-0" />
          <span>NexCinema Complex Lê Duẩn • Tầng 4, TTTM Diamond Plaza, 34 Lê Duẩn, Q.1</span>
        </div>
      </div>

      {/* Date Ribbon Tabs */}
      <div className="w-full overflow-x-auto pb-1 flex items-center gap-2 scrollbar-none">
        {datesList.map((d) => {
          const isSelected = selectedDate === d.dateStr;
          return (
            <button
              key={d.dateStr}
              onClick={() => onSelectDate(d.dateStr)}
              className={`shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-sm cursor-pointer ${
                isSelected
                  ? 'bg-[#d71920] text-white font-bold'
                  : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
              }`}
            >
              <span className="text-[11px] opacity-80 font-normal">{d.dayName}</span>
              <span className="text-xs">{d.label}</span>
            </button>
          );
        })}
      </div>

      {/* Showtime Groups by Room */}
      <div className="flex flex-col gap-6 pt-2">
        {roomGroups.map((group) => (
          <div key={group.roomId} className="flex flex-col gap-3 pt-3 border-t border-[#e4e2e2]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${group.formatColorClass}`}
                >
                  {group.formatTag}
                </span>
                <h3 className="font-bold text-sm text-[#1b1c1c]">{group.roomName}</h3>
              </div>
              <span className="text-xs text-[#5f5e5e] hidden sm:inline">
                {group.techInfo}
              </span>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              {group.slots.map((slot) => {
                const isSelected = selectedShowtime?.slotId === slot.id;
                if (slot.isSoldOut) {
                  return (
                    <div
                      key={slot.id}
                      className="p-3 rounded-lg bg-[#e4e2e2]/60 text-left flex flex-col opacity-60 cursor-not-allowed select-none border border-[#e4e2e2]"
                    >
                      <span className="font-bold text-sm text-[#5f5e5e] line-through">
                        {slot.time}
                      </span>
                      <span className="text-[11px] text-[#ba1a1a] font-bold mt-0.5">
                        Hết vé
                      </span>
                    </div>
                  );
                }

                return (
                  <button
                    key={slot.id}
                    onClick={() => onSelectSlot(slot, group)}
                    className={`p-3 rounded-lg text-left transition-all flex flex-col shadow-sm border cursor-pointer ${
                      isSelected
                        ? 'bg-[#d71920] text-white border-[#d71920]'
                        : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] hover:border-[#d71920] text-[#1b1c1c] border-[#e4e2e2]'
                    }`}
                  >
                    <span className="font-extrabold text-sm">{slot.time}</span>
                    <span
                      className={`text-[11px] mt-0.5 ${
                        isSelected
                          ? 'text-white/90 font-medium'
                          : slot.isHot
                          ? 'text-[#d71920] font-bold'
                          : 'text-[#5f5e5e]'
                      }`}
                    >
                      {slot.isHot ? 'Còn 8 ghế (Sắp hết)' : `Còn ${slot.seatsLeft} ghế`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* INLINE SEAT SELECTION CALLOUT BAR */}
      {selectedShowtime && (
        <div className="bg-[#efeded] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-[#d71920]/30 animate-in fade-in duration-300">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-full bg-[#d71920] text-white flex items-center justify-center shrink-0 shadow-md">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs text-[#5f5e5e]">Suất chiếu đã chọn:</span>
              <span className="font-bold text-sm text-[#1b1c1c]">
                {selectedShowtime.time} • {selectedShowtime.roomName} • Hôm nay
              </span>
            </div>
          </div>

          <button
            onClick={onContinueToSeatSelection}
            className="w-full sm:w-auto px-6 h-11 bg-[#d71920] hover:bg-[#ae0011] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>CHỌN GHẾ & TIẾP TỤC</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </section>
  );
};

export default MovieShowtimesSection;
