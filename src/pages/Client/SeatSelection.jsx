import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, MonitorPlay } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSeatMap, holdSeats } from '../../api/bookingApi';
import { CinemaSeat, SeatLegend } from '../../components/Seats/SeatVisuals';
import { formatVND } from '../../utils/formatHelper';

const parseStructure = (value) => {
  if (!value) return null;
  try { return typeof value === 'string' ? JSON.parse(value) : value; } catch { return null; }
};

const isAislePosition = (structure, rowIndex, columnIndex) => {
  if (!structure?.aisles) return false;
  if (structure.aisles.cols?.includes(columnIndex + 1) || structure.aisles.rows?.includes(rowIndex + 1)) return true;
  const customRow = structure.aisles.custom?.find((item) => item.row === rowIndex);
  return Boolean(customRow?.cols?.includes(columnIndex) || customRow?.cols?.includes(columnIndex + 1));
};

const getSeatState = (seat) => {
  if (seat.TrangThai === 'DA_DAT') return 'sold';
  if (seat.TrangThai === 'DANG_GIU') return 'held';
  return 'available';
};

const SeatMap = ({ data, selectedSeats, onSeatClick }) => {
  const { rows, totalColumns, structure } = useMemo(() => {
    if (!data) return { rows: [], totalColumns: 0, structure: null };
    const grouped = data.Ghe.reduce((result, seat) => {
      const row = seat.TenGhe.charAt(0);
      result[row] ||= {};
      result[row][Number.parseInt(seat.TenGhe.slice(1), 10)] = seat;
      return result;
    }, {});
    return {
      rows: Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)),
      totalColumns: data.SoDoGhe.TongCot,
      structure: parseStructure(data.SoDoGhe.CauTruc),
    };
  }, [data]);

  return (
    <div className="mx-auto flex min-w-max flex-col items-center px-4 pb-3">
      <div className="mb-1.5 flex items-center gap-1.5">
        <span className="w-7" />
        {Array.from({ length: totalColumns }, (_, index) => (
          <span key={index} className="grid h-5 w-9 place-items-center font-mono text-[10px] font-bold text-slate-400">{index + 1}</span>
        ))}
        <span className="w-7" />
      </div>
      <div className="flex flex-col gap-1">
        {rows.map(([rowName, columns], rowIndex) => (
          <div key={rowName} className="flex items-center gap-1.5">
            <span className="w-7 text-center font-mono text-xs font-bold text-slate-400">{rowName}</span>
            {Array.from({ length: totalColumns }, (_, columnIndex) => {
              const seat = columns[columnIndex + 1];
              if (!seat || isAislePosition(structure, rowIndex, columnIndex)) return <span key={`${rowName}-${columnIndex}`} className="h-9 w-9 shrink-0" />;
              const state = getSeatState(seat);
              const selected = selectedSeats.some((item) => item.MaGheSuatChieu === seat.MaGheSuatChieu);
              return <CinemaSeat key={seat.MaGheSuatChieu} label={seat.TenGhe} typeName={seat.TenLoaiGhe} state={state} selected={selected} disabled={state !== 'available'} onClick={() => onSeatClick(seat)} title={`${seat.TenGhe} · ${seat.TenLoaiGhe} · ${seat.GiaVeTinhToan.toLocaleString('vi-VN')} đ`} />;
            })}
            <span className="w-7 text-center font-mono text-xs font-bold text-slate-400">{rowName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeatSelection = ({ availableSlots, selectedSlotIndex, setSelectedSlotIndex, onBack, formatTime, onConfirmBooking, shouldReloadSeatMap }) => {
  const navigate = useNavigate();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatMapData, setSeatMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isHolding, setIsHolding] = useState(false);
  const lastShowtimeId = useRef('');
  const currentSlot = availableSlots[selectedSlotIndex];
  const totalAmount = selectedSeats.reduce((total, seat) => total + seat.GiaVeTinhToan, 0);

  useEffect(() => {
    const showtimeId = currentSlot?.MaSuatChieu || currentSlot?.showId;
    if (!showtimeId) return undefined;
    let ignore = false;
    const loadSeats = async () => {
      setIsLoading(true);
      try {
        const result = await getSeatMap(showtimeId);
        if (ignore) return;
        setSeatMapData(result);
        if (lastShowtimeId.current !== showtimeId) {
          setSelectedSeats([]);
          lastShowtimeId.current = showtimeId;
        }
      } catch (error) {
        if (!ignore) toast.error('Không thể tải sơ đồ ghế của suất chiếu này.');
        console.error('Error fetching seat map:', error);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    loadSeats();
    return () => { ignore = true; };
  }, [currentSlot, shouldReloadSeatMap]);

  const handleSeatClick = (seat) => {
    if (seat.TrangThai !== 'TRONG') return;
    setSelectedSeats((current) => current.some((item) => item.MaGheSuatChieu === seat.MaGheSuatChieu)
      ? current.filter((item) => item.MaGheSuatChieu !== seat.MaGheSuatChieu)
      : [...current, seat]);
  };

  const handleConfirm = async () => {
    if (!selectedSeats.length) return;
    if (!localStorage.getItem('accessToken')) {
      toast.error('Vui lòng đăng nhập tài khoản khách hàng để thực hiện đặt vé!');
      navigate('/login', { state: { from: `/movie/${currentSlot?.MaPhim}` } });
      return;
    }
    const showtimeId = currentSlot?.MaSuatChieu || currentSlot?.showId;
    if (!showtimeId) return toast.error('Không tìm thấy thông tin suất chiếu.');
    try {
      setIsHolding(true);
      const seatIds = selectedSeats.map((seat) => seat.MaGheSuatChieu);
      await holdSeats(showtimeId, seatIds);
      onConfirmBooking(selectedSeats, totalAmount, seatIds, showtimeId);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { state: { from: `/movie/${currentSlot?.MaPhim}` } });
      } else if (error.response?.status === 403) toast.error('Tài khoản không có quyền giữ ghế');
      else toast.error(error.response?.data?.message || error.message || 'Giữ ghế thất bại, vui lòng chọn ghế khác.');
      try { setSeatMapData(await getSeatMap(showtimeId)); } catch (reloadError) { console.error('Error reloading seat map:', reloadError); }
    } finally { setIsHolding(false); }
  };

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-[250px_minmax(0,1fr)] lg:overflow-hidden">
      <aside className="flex min-h-fit flex-col overflow-visible rounded-2xl bg-white p-4 text-left shadow-sm ring-1 ring-black/5 lg:min-h-0 lg:overflow-hidden">
        <button onClick={onBack} className="mb-3 flex items-center gap-1 text-xs font-semibold text-neutral-500 transition-colors hover:text-neutral-950"><ChevronLeft size={15} /> Quay lại chi tiết</button>
        <div className="mb-3 flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-neutral-600">
          <Clock size={15} className="text-(--client-primary)" /><span className="flex-1">Hạn thanh toán</span><strong className="rounded-full bg-white px-2 py-1 text-[10px] text-(--client-primary)">10 phút</strong>
        </div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-neutral-500">Chọn suất chiếu</p>
        <div className="min-h-0 space-y-2 overflow-y-auto pr-1">
          {availableSlots.map((slot, index) => (
            <button key={slot.MaSuatChieu || slot.showId || index} onClick={() => setSelectedSlotIndex(index)} className={`flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${index === selectedSlotIndex ? 'bg-(--client-primary) text-white shadow-[0_8px_20px_rgba(215,25,32,.18)]' : 'bg-neutral-50 text-neutral-600 hover:bg-red-50 hover:text-(--client-primary)'}`}>
              <Clock size={15} /> {formatTime(slot.time || slot.GioChieu)}
            </button>
          ))}
        </div>
      </aside>

      <section className="grid min-h-[620px] grid-rows-[auto_auto_auto_minmax(190px,1fr)_auto] overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 lg:min-h-0">
        <div className="flex items-start justify-between gap-4">
          <div><span className="text-[9px] font-bold uppercase tracking-[.2em] text-(--client-primary)">Bước 02</span><h1 className="text-xl font-extrabold tracking-tight text-neutral-950">Chọn ghế ngồi</h1></div>
          <div className="text-right text-xs text-neutral-500"><strong className="block text-sm text-neutral-950">{formatTime(currentSlot?.time || currentSlot?.GioChieu || '00:00')}</strong>{seatMapData?.SoDoGhe && <span>{seatMapData.SoDoGhe.TongHang} hàng · {seatMapData.SoDoGhe.TongCot} cột</span>}</div>
        </div>
        <div className="mx-auto mt-2 flex w-full max-w-2xl items-center gap-3" aria-label="Vị trí màn hình">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-red-200" /><div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-[9px] font-bold uppercase tracking-[.18em] text-(--client-primary)"><MonitorPlay size={15} /> Màn hình</div><span className="h-px flex-1 bg-gradient-to-l from-transparent to-red-200" />
        </div>
        <SeatLegend className="border-b border-neutral-100 py-2.5" />
        <div className="min-h-0 overflow-auto py-2 custom-scrollbar">
          {isLoading ? <div className="grid h-full min-h-48 place-items-center text-center"><div><span className="mx-auto block size-8 animate-spin rounded-full border-2 border-red-100 border-t-(--client-primary)" /><p className="mt-3 text-xs font-semibold text-neutral-500">Đang tải sơ đồ ghế…</p></div></div> : <SeatMap data={seatMapData} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />}
        </div>
        <div className="grid items-center gap-3 border-t border-neutral-100 pt-3 sm:grid-cols-[1fr_auto]">
          <div className="grid min-w-0 grid-cols-3 gap-3 text-xs">
            <div><span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Suất chiếu</span><strong className="text-neutral-950">{formatTime(currentSlot?.time || currentSlot?.GioChieu || '00:00')}</strong></div>
            <div className="min-w-0"><span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Ghế đã chọn</span><strong className="block truncate text-neutral-950">{selectedSeats.length ? selectedSeats.map((seat) => seat.TenGhe).join(', ') : 'Chưa chọn'}</strong></div>
            <div><span className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400">Tổng tiền</span><strong className="text-(--client-primary)">{formatVND(totalAmount)}</strong></div>
          </div>
          <button disabled={!selectedSeats.length || isHolding} onClick={handleConfirm} className="group flex h-11 items-center justify-center gap-3 rounded-full bg-(--client-primary) pl-5 pr-2 text-xs font-bold text-white transition-all duration-500 ease-[cubic-bezier(.32,.72,0,1)] enabled:hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40">
            {isHolding ? 'Đang giữ ghế…' : `Tiếp tục (${selectedSeats.length})`}<span className="grid size-7 place-items-center rounded-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0.5"><ChevronRight size={15} /></span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default SeatSelection;
