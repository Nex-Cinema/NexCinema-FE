import { CalendarDays, Clock, Film, MapPin, Ticket } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const toDateLabel = (value) => {
  if (!value) return 'Hôm nay';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN');
};

const QuickBookingDock = ({ movies, showtimes }) => {
  const navigate = useNavigate();
  const [movieId, setMovieId] = useState(movies[0]?.MaPhim || '');
  const movieSlots = useMemo(() => showtimes.filter((slot) => String(slot.MaPhim) === String(movieId)), [showtimes, movieId]);
  const dates = useMemo(() => [...new Set(movieSlots.map((slot) => slot.NgayChieu || slot.NgayKhoiChieu).filter(Boolean))], [movieSlots]);
  const [date, setDate] = useState('');
  const slots = movieSlots.filter((slot) => !date || (slot.NgayChieu || slot.NgayKhoiChieu) === date);
  const [showtimeId, setShowtimeId] = useState('');

  const updateMovie = (value) => { setMovieId(value); setDate(''); setShowtimeId(''); };
  const book = () => showtimeId ? navigate(`/booking/${showtimeId}`) : movieId && navigate(`/movie/${movieId}`);

  return (
    <section className="relative z-20 mx-auto -mt-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Đặt vé nhanh">
      <div className="rounded-xl bg-white p-4 shadow-xl lg:p-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-neutral-900"><Ticket size={21} className="text-(--client-primary)" />Đặt vé nhanh trực tuyến</h2>
          <span className="flex items-center gap-1 text-xs text-neutral-500"><MapPin size={15} className="text-(--client-primary)" />NexCinema</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label className="space-y-1.5 text-xs font-semibold text-neutral-500"><span className="flex items-center gap-1"><Film size={14} />1. Chọn phim</span><select value={movieId} onChange={(event) => updateMovie(event.target.value)} className="h-11 w-full rounded-lg bg-[#f5f3f3] px-3 text-sm text-neutral-900 outline-none focus:ring-1 focus:ring-(--client-primary)">{movies.map((movie) => <option key={movie.MaPhim} value={movie.MaPhim}>{movie.TenPhim}</option>)}</select></label>
          <label className="space-y-1.5 text-xs font-semibold text-neutral-500"><span className="flex items-center gap-1"><CalendarDays size={14} />2. Chọn ngày chiếu</span><select value={date} onChange={(event) => { setDate(event.target.value); setShowtimeId(''); }} className="h-11 w-full rounded-lg bg-[#f5f3f3] px-3 text-sm text-neutral-900 outline-none focus:ring-1 focus:ring-(--client-primary)"><option value="">Tất cả ngày</option>{dates.map((item) => <option key={item} value={item}>{toDateLabel(item)}</option>)}</select></label>
          <label className="space-y-1.5 text-xs font-semibold text-neutral-500"><span className="flex items-center gap-1"><Clock size={14} />3. Suất chiếu</span><select value={showtimeId} onChange={(event) => setShowtimeId(event.target.value)} className="h-11 w-full rounded-lg bg-[#f5f3f3] px-3 text-sm text-neutral-900 outline-none focus:ring-1 focus:ring-(--client-primary)"><option value="">Chọn suất chiếu</option>{slots.map((slot) => <option key={slot.MaSuatChieu} value={slot.MaSuatChieu}>{slot.GioChieu} · {slot.TenPhong}</option>)}</select></label>
          <div className="flex flex-col justify-end"><button type="button" onClick={book} disabled={!movieId} className="client-primary-button h-11 w-full"><Ticket size={18} />{showtimeId ? 'Mua vé ngay' : 'Xem lịch chiếu'}</button></div>
        </div>
      </div>
    </section>
  );
};

export default QuickBookingDock;
