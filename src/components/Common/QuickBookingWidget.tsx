import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, MapPin, ChevronDown, Calendar, Clock, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickBookingWidget: React.FC = () => {
  const navigate = useNavigate();

  const [selectedMovie, setSelectedMovie] = useState('dune2');
  const [selectedDate, setSelectedDate] = useState('2024-10-28');
  const [selectedTime, setSelectedTime] = useState('19:30');

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đang chuyển tới màn hình chọn ghế...");
    navigate(`/booking/${selectedMovie}`);
  };

  return (
    <section className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-12" id="quick-booking">
      <div className="bg-white rounded-xl p-4 lg:p-6 shadow-xl border border-gray-100 text-left">
        
        {/* WIDGET HEADER */}
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#d71920] fill-[#d71920]" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
              Đặt vé nhanh trực tuyến
            </h2>
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#d71920]" /> NexCinema Lê Duẩn, Q.1
          </span>
        </div>

        {/* 4-STEP FORM */}
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" onSubmit={handleBookingSubmit}>
          
          {/* STEP 1: CHỌN PHIM */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="quick-movie-select">
              <span className="w-4 h-4 rounded-full bg-[#d71920] text-white text-[10px] flex items-center justify-center font-bold">1</span>
              Chọn phim
            </label>
            <div className="relative">
              <select 
                id="quick-movie-select"
                value={selectedMovie}
                onChange={(e) => setSelectedMovie(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-lg bg-gray-100 text-gray-900 text-xs font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-[#d71920] focus:bg-white cursor-pointer transition-colors"
              >
                <option value="dune2">Dune: Hành Tinh Cát 2 (IMAX, 2D)</option>
                <option value="godzilla">Godzilla x Kong: Đế Chế Mới</option>
                <option value="latmat7">Lật Mặt 7: Một Điều Ước</option>
                <option value="kungfupanda">Kung Fu Panda 4</option>
                <option value="planetapes">Hành Tinh Khỉ: Vương Quốc Mới</option>
                <option value="exhuma">Exhuma: Quật Mộ Trùng Ma</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* STEP 2: CHỌN NGÀY */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="quick-date-select">
              <span className="w-4 h-4 rounded-full bg-[#d71920] text-white text-[10px] flex items-center justify-center font-bold">2</span>
              Chọn ngày chiếu
            </label>
            <div className="relative">
              <select 
                id="quick-date-select"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-lg bg-gray-100 text-gray-900 text-xs font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-[#d71920] focus:bg-white cursor-pointer transition-colors"
              >
                <option value="2024-10-28">Hôm nay, 28/10/2024</option>
                <option value="2024-10-29">Ngày mai, 29/10/2024</option>
                <option value="2024-10-30">Thứ Tư, 30/10/2024</option>
                <option value="2024-10-31">Thứ Năm, 31/10/2024</option>
                <option value="2024-11-01">Thứ Sáu, 01/11/2024</option>
                <option value="2024-11-02">Thứ Bảy, 02/11/2024</option>
              </select>
              <Calendar className="absolute right-2.5 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* STEP 3: CHỌN SUẤT CHIẾU */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5" htmlFor="quick-time-select">
              <span className="w-4 h-4 rounded-full bg-[#d71920] text-white text-[10px] flex items-center justify-center font-bold">3</span>
              Suất chiếu
            </label>
            <div className="relative">
              <select 
                id="quick-time-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full h-11 pl-3 pr-8 rounded-lg bg-gray-100 text-gray-900 text-xs font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-[#d71920] focus:bg-white cursor-pointer transition-colors"
              >
                <option value="09:30">09:30 - Rạp 03 (2D Phụ đề)</option>
                <option value="13:15">13:15 - Rạp 02 (2D Phụ đề)</option>
                <option value="16:45">16:45 - Rạp IMAX (IMAX Laser)</option>
                <option value="19:30">19:30 - Rạp IMAX (IMAX Laser) • Hot</option>
                <option value="21:50">21:50 - Rạp 01 (2D Phụ đề)</option>
              </select>
              <Clock className="absolute right-2.5 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* STEP 4: SUBMIT BUTTON */}
          <div className="flex flex-col justify-end">
            <button 
              type="submit"
              className="w-full h-11 rounded-lg bg-[#d71920] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Mua vé ngay</span>
            </button>
          </div>

        </form>
      </div>
    </section>
  );
};

export default QuickBookingWidget;
