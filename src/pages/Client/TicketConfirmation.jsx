import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CheckCircle, Copy, Info } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';

import { formatVND } from '../../utils/formatHelper';
import { formatShowtimeTime } from '../../utils/showtimeHelper';

const SUCCESS_STATUSES = new Set(['DA_THANH_TOAN', 'THANH_CONG', 'SUCCESS']);

const TicketConfirmation = ({ movie, selectedDateId, currentSlot, selectedSeats = [], formatTime = formatShowtimeTime, onHome, bookingResult }) => {
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState('');
  const tickets = useMemo(() => (bookingResult?.ChiTietDatVes || []).map((ticket) => ({
    ...ticket,
    seatName: ticket.Ghe?.TenGhe || 'Chưa có thông tin',
    capacity: Number(ticket.Ghe?.SucChua || ticket.SucChua || 1),
  })), [bookingResult]);
  const showtime = tickets[0]?.SuatChieu || currentSlot;
  const movieTitle = showtime?.Phim?.TenPhim || movie?.TenPhim || movie?.title || 'Chưa có thông tin phim';
  const poster = showtime?.Phim?.HinhAnh || movie?.HinhAnh || movie?.poster_path;
  const showDate = showtime?.NgayChieu ? new Date(showtime.NgayChieu).toLocaleDateString('vi-VN') : selectedDateId || 'Chưa có thông tin';
  const bookingStatus = bookingResult?.TrangThai || bookingResult?.TrangThaiThanhToan || bookingResult?.GiaoDichs?.find((item) => SUCCESS_STATUSES.has(item.TrangThai))?.TrangThai;
  const isSuccess = SUCCESS_STATUSES.has(bookingStatus);

  const handleCopyCode = async (code) => {
    if (!code) return;
    try { await navigator.clipboard.writeText(code); setCopiedId(code); toast.success('Đã sao chép mã.'); window.setTimeout(() => setCopiedId(''), 2000); }
    catch { toast.error('Không thể sao chép. Vui lòng thử lại.'); }
  };

  return <main className="min-h-screen bg-neutral-100 px-4 pb-12 pt-28 text-neutral-900">
    <div className="mx-auto max-w-3xl">
      <header className="mb-6 flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
        <span className={`grid size-11 shrink-0 place-items-center rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{isSuccess ? <CheckCircle /> : <Info />}</span>
        <div><h1 className="text-2xl font-bold">{isSuccess ? 'Đặt vé thành công' : 'Đang cập nhật trạng thái đặt vé'}</h1><p className="mt-1 text-sm text-neutral-600">{isSuccess ? 'Xuất trình mã QR của từng vé khi vào phòng chiếu.' : 'Vui lòng kiểm tra lịch sử đặt vé để xem trạng thái chính xác.'}</p></div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <div className="border-b-2 border-dashed border-neutral-200 p-6"><div className="flex gap-4">{poster && <img src={poster} alt={`Áp phích ${movieTitle}`} className="h-24 w-16 shrink-0 rounded-lg object-cover" />}<div><p className="text-sm text-red-700">Vé điện tử</p><h2 className="mt-1 text-xl font-bold">{movieTitle}</h2></div></div><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3"><div><dt className="text-neutral-500">Ngày chiếu</dt><dd className="mt-1 font-semibold">{showDate}</dd></div><div><dt className="text-neutral-500">Giờ chiếu</dt><dd className="mt-1 font-semibold">{formatTime(showtime?.GioChieu || showtime?.time)}</dd></div><div><dt className="text-neutral-500">Phòng chiếu</dt><dd className="mt-1 font-semibold">{showtime?.PhongChieu?.TenPhong || showtime?.TenPhong || 'Chưa có thông tin'}</dd></div></dl></div>
        <div className="p-6"><div className="mb-5 flex min-w-0 flex-wrap justify-between gap-3 text-sm"><span className="min-w-0">Mã đặt vé: <strong className="break-all font-mono">{bookingResult?.MaPhieuDat || 'Chưa có'}</strong></span><strong>{formatVND(bookingResult?.TongTien)}</strong></div>
          {tickets.length > 0 ? <div className="grid gap-4 sm:grid-cols-2">{tickets.map((ticket) => <article key={ticket.MaChiTietDat || ticket.seatName} className="flex gap-4 rounded-xl border border-neutral-200 p-4">{ticket.MaChiTietDat && isSuccess && <QRCodeSVG value={ticket.MaChiTietDat} size={104} level="M" title={`Mã QR vé ghế ${ticket.seatName}`} className="shrink-0" />}<div className="min-w-0"><h3 className="font-bold">Ghế {ticket.seatName}</h3><p className="mt-1 text-sm text-neutral-600">{ticket.capacity > 1 ? `${ticket.capacity} người / ghế đôi` : '1 người'}</p><p className="mt-1 text-sm font-semibold text-red-700">{formatVND(ticket.GiaVe)}</p>{ticket.MaChiTietDat && <div className="mt-3 flex items-center gap-2"><code className="truncate text-xs text-neutral-500">{ticket.MaChiTietDat}</code><button type="button" title="Sao chép mã vé" aria-label={`Sao chép mã vé ghế ${ticket.seatName}`} onClick={() => handleCopyCode(ticket.MaChiTietDat)} className="rounded p-1 text-neutral-600 hover:bg-neutral-100">{copiedId === ticket.MaChiTietDat ? <Check size={15} /> : <Copy size={15} />}</button></div>}</div></article>)}</div> : <div className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">Chi tiết mã vé chưa được trả về. Ghế đã chọn: {selectedSeats.map((seat) => seat?.TenGhe || seat).filter(Boolean).join(', ') || 'chưa có thông tin'}. Kiểm tra lại trong lịch sử đặt vé.</div>}
        </div>
      </section>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end"><button type="button" onClick={onHome} className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold">Về trang chủ</button><button type="button" onClick={() => navigate('/profile', { state: { activeTab: 'upcoming' } })} className="rounded-xl bg-(--client-primary) px-5 py-3 text-sm font-semibold text-white hover:bg-(--client-primary-hover)">Xem vé của tôi</button></div>
    </div>
  </main>;
};

export default TicketConfirmation;
