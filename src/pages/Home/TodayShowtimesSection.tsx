import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { ROUTES } from '@/constants/routes';
import AgeBadge from '@/components/shared/AgeBadge';
import ShowtimePill from '@/components/shared/ShowtimePill';
import MoviePoster from '@/components/shared/MoviePoster';

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
  { dayLabel: 'Chủ Nhật', dateStr: '03/11', fullDate: '2024-11-03' },
];

const TodayShowtimesSection: React.FC = () => {
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  const [selectedDate, setSelectedDate] = useState('2024-10-28');
  const [formatFilter, setFormatFilter] = useState<'all' | '2d' | 'imax'>('all');

  const handleShowtimeClick = (slotId: string) => {
    const targetUrl = ROUTES.BOOKING.SEAT_SELECTION(slotId);
    if (!requireAuth(undefined, targetUrl)) {
      return;
    }
    toast.success('Đang chuyển đến màn hình chọn ghế...');
    navigate(targetUrl);
  };

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
            <span className="text-xs text-[#5f5e5e]">Định dạng chiếu:</span>
            <button 
              onClick={() => setFormatFilter('all')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === 'all' ? 'bg-[#efeded] text-gray-900' : 'text-[#5f5e5e] hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => setFormatFilter('2d')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === '2d' ? 'bg-[#efeded] text-gray-900' : 'text-[#5f5e5e] hover:bg-gray-100'
              }`}
            >
              2D Phụ đề
            </button>
            <button 
              onClick={() => setFormatFilter('imax')}
              className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                formatFilter === 'imax' ? 'bg-[#efeded] text-gray-900' : 'text-[#5f5e5e] hover:bg-gray-100'
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
              <MoviePoster
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsvnK8eJ0wALfItVJsqupCJzMagS-bfICkTAZe0o4DQBYAiIILEID9oIgCmFNp0G3HNGfVdzG_uZcyB-HbNCe1CMDZ4GveXFeNNx4z03uOU51kKwidQUJsKBDspsbuwKDR_0Ow9KG_Yl-b-DQqxbVKAQby0QECifPSH14WSvGx4XQu-dCS-pYMPuOpfw8kUq_ZgpndjlbhuMDgZCmWK4Zj5dOeK1rboBWApdE5WvKqTvlDpiYa2zAsqw"
                alt="Dune 2"
                className="w-16 h-24 rounded-lg flex-shrink-0"
              />
              <div className="space-y-1">
                <AgeBadge rating="C16" />
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
                  <ShowtimePill id="st-101" time="13:30" seatsLeft={48} onClick={() => handleShowtimeClick('st-101')} />
                  <ShowtimePill id="st-102" time="16:45" seatsLeft={22} onClick={() => handleShowtimeClick('st-102')} />
                  <ShowtimePill id="st-103" time="19:30" seatsLeft={8} isHot onClick={() => handleShowtimeClick('st-103')} />
                  <ShowtimePill id="st-104" time="22:15" seatsLeft={64} onClick={() => handleShowtimeClick('st-104')} />
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Phòng Rạp 02 • 2D Phụ đề
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <ShowtimePill id="st-201" time="10:00" seatsLeft={85} onClick={() => handleShowtimeClick('st-201')} />
                  <ShowtimePill id="st-202" time="14:15" seatsLeft={51} onClick={() => handleShowtimeClick('st-202')} />
                  <ShowtimePill id="st-203" time="17:40" seatsLeft={30} onClick={() => handleShowtimeClick('st-203')} />
                </div>
              </div>
            </div>
          </div>

          {/* GODZILLA X KONG SHOWTIMES */}
          <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex flex-col lg:flex-row gap-4">
            <div className="flex gap-4 lg:w-72 flex-shrink-0">
              <MoviePoster
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXfUBhaIEiJyrypDlluJqhf2sVBHU-mtaUUlhqOyeZZgn-SIJc2ardqZL7UVP-hKi6VEmhoT2GO8wHsSB39nXosQa4e9Bzp_Zp04k83zok_8MQkaMvCLx1IVnUjRVFI5OqbDspZbc8IBJdQuXzQcO8010O4Dv-HrtcZKMIWHyVp37Klk89AzFdQjoK6T2uQxGyxaEPr9nDo99loOk2Y5PDRg3zbbK4AwBEsmYRfWp5vaM-XMpLIfdfbA"
                alt="Godzilla x Kong"
                className="w-16 h-24 rounded-lg flex-shrink-0"
              />
              <div className="space-y-1">
                <AgeBadge rating="C13" />
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
                  <ShowtimePill id="st-301" time="11:15" seatsLeft={40} onClick={() => handleShowtimeClick('st-301')} />
                  <ShowtimePill id="st-302" time="15:00" seatsLeft={18} onClick={() => handleShowtimeClick('st-302')} />
                  <ShowtimePill id="st-303" time="18:30" seatsLeft={12} onClick={() => handleShowtimeClick('st-303')} />
                  <ShowtimePill id="st-304" time="21:05" seatsLeft={55} onClick={() => handleShowtimeClick('st-304')} />
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
