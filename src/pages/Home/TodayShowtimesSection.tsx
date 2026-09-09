import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateItem {
  dayLabel: string; // e.g. "Thứ Hai"
  dateStr: string;  // e.g. "28/10"
  fullDate: string; // e.g. "2024-10-28"
  isToday?: boolean;
}

const DATES: DateItem[] = [
  { dayLabel: 'Thứ Hai', dateStr: '28/10', fullDate: '2024-10-28', isToday: true },
  { dayLabel: 'Thứ Ba', dateStr: '29/10', fullDate: '2024-10-29' },
  { dayLabel: 'Thứ Tư', dateStr: '30/10', fullDate: '2024-10-30' },
  { dayLabel: 'Thứ Năm', dateStr: '31/10', fullDate: '2024-10-31' },
  { dayLabel: 'Thứ Sáu', dateStr: '01/11', fullDate: '2024-11-01' },
  { dayLabel: 'Thứ Bảy', dateStr: '02/11', fullDate: '2024-11-02' },
  { dayLabel: 'Chủ Nhật', dateStr: '03/11', fullDate: '2024-11-03' }
];

const TodayShowtimesSection: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('2024-10-28');
  const [formatFilter, setFormatFilter] = useState<'all' | '2d' | 'imax'>('all');

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-16" id="showtimes-section">
      <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md border border-gray-100 text-left">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold text-[#d71920] uppercase tracking-wider">
              Lịch chiếu phim
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-gray-900">
              Lịch Chiếu Hôm Nay Tại Rạp
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Định dạng chiếu:</span>
            <button 
              onClick={() => setFormatFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === 'all' ? 'bg-[#efeded] text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFormatFilter('2d')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === '2d' ? 'bg-[#efeded] text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              2D Phụ đề
            </button>
            <button 
              onClick={() => setFormatFilter('imax')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === 'imax' ? 'bg-[#efeded] text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              IMAX Laser
            </button>
          </div>
        </div>

        {/* 7-DAY DATE RIBBON */}
        <div className="flex items-center gap-2 sm:gap-3 mb-8">
          <button className="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs font-semibold cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-gray-500" />
            <span className="hidden sm:inline">Tuần trước</span>
          </button>

          <div className="flex-1 grid grid-cols-7 gap-1.5 sm:gap-2">
            {DATES.map((d) => {
              const isSelected = selectedDate === d.fullDate;
              return (
                <button
                  key={d.fullDate}
                  onClick={() => setSelectedDate(d.fullDate)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#d71920] text-white font-bold shadow-md scale-102' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-80">{d.dayLabel}</span>
                  <span className="text-xs sm:text-sm font-bold mt-0.5">{d.dateStr}</span>
                </button>
              );
            })}
          </div>

          <button className="flex-shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors text-xs font-semibold cursor-pointer">
            <span className="hidden sm:inline">Tuần sau</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* SHOWTIME MOVIE ROWS */}
        <div className="space-y-6">

          {/* DUNE 2 SHOWTIMES */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col lg:flex-row gap-4">
            <div className="flex gap-4 lg:w-72 flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsvnK8eJ0wALfItVJsqupCJzMagS-bfICkTAZe0o4DQBYAiIILEID9oIgCmFNp0G3HNGfVdzG_uZcyB-HbNCe1CMDZ4GveXFeNNx4z03uOU51kKwidQUJsKBDspsbuwKDR_0Ow9KG_Yl-b-DQqxbVKAQby0QECifPSH14WSvGx4XQu-dCS-pYMPuOpfw8kUq_ZgpndjlbhuMDgZCmWK4Zj5dOeK1rboBWApdE5WvKqTvlDpiYa2zAsqw" 
                alt="Dune 2"
                className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="px-1.5 py-0.5 rounded bg-amber-500 text-gray-900 font-bold text-[10px]">C16</span>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">Dune: Hành Tinh Cát 2</h4>
                <p className="text-xs text-gray-500">166 phút • 2D / IMAX</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Phòng IMAX Laser (Âm thanh 12 kênh)
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">13:30</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 48 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">16:45</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 22 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-[#d71920] text-white shadow-xs group text-left cursor-pointer">
                    <div className="font-bold text-xs">19:30</div>
                    <div className="text-[10px] text-white/80">Còn 8 ghế (Hot)</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">22:15</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 64 ghế</div>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Phòng Rạp 02 • 2D Phụ đề
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">10:00</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 85 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">14:15</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 51 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">17:40</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 30 ghế</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* GODZILLA X KONG SHOWTIMES */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col lg:flex-row gap-4">
            <div className="flex gap-4 lg:w-72 flex-shrink-0">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXfUBhaIEiJyrypDlluJqhf2sVBHU-mtaUUlhqOyeZZgn-SIJc2ardqZL7UVP-hKi6VEmhoT2GO8wHsSB39nXosQa4e9Bzp_Zp04k83zok_8MQkaMvCLx1IVnUjRVFI5OqbDspZbc8IBJdQuXzQcO8010O4Dv-HrtcZKMIWHyVp37Klk89AzFdQjoK6T2uQxGyxaEPr9nDo99loOk2Y5PDRg3zbbK4AwBEsmYRfWp5vaM-XMpLIfdfbA" 
                alt="Godzilla x Kong"
                className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px]">C13</span>
                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">Godzilla x Kong</h4>
                <p className="text-xs text-gray-500">115 phút • 2D / 3D Atmos</p>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Phòng Rạp 01 • 3D Dolby Atmos
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">11:15</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 40 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">15:00</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 18 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">18:30</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 12 ghế</div>
                  </button>
                  <button className="px-3.5 py-2 rounded-lg bg-white hover:bg-[#d71920] hover:text-white text-gray-900 shadow-xs transition-colors group text-left border border-gray-100 cursor-pointer">
                    <div className="font-bold text-xs">21:05</div>
                    <div className="text-[10px] text-gray-500 group-hover:text-white/80">Còn 55 ghế</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default TodayShowtimesSection;
