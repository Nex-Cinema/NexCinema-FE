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
  const qrPayload = bookingResult?.QRPayload;

  const handleCopyCode = async (code) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(code);
      toast.success('Đã sao chép mã.');
      window.setTimeout(() => setCopiedId(''), 2000);
    } catch {
      toast.error('Không thể sao chép. Vui lòng thử lại.');
    }
  };

  return (
    <main className="min-h-screen bg-neutral-100 px-4 pb-12 pt-28 text-neutral-900">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6 flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6">
          <span className={`grid size-11 shrink-0 place-items-center rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {isSuccess ? <CheckCircle /> : <Info />}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{isSuccess ? 'Đặt vé thành công' : 'Đang cập nhật trạng thái đặt vé'}</h1>
            <p className="mt-1 text-sm text-neutral-600">
              {isSuccess
                ? (qrPayload ? 'Xuất trình mã QR đặt vé khi vào phòng chiếu.' : 'Vui lòng kiểm tra thông tin vé bên dưới.')
                : 'Vui lòng kiểm tra lịch sử đặt vé để xem trạng thái chính xác.'}
            </p>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="border-b-2 border-dashed border-neutral-200 p-6">
            <div className="flex gap-4">
              {poster && <img src={poster} alt={`Áp phích ${movieTitle}`} className="h-24 w-16 shrink-0 rounded-lg object-cover" />}
              <div>
                <p className="text-sm text-red-700">Vé điện tử</p>
                <h2 className="mt-1 text-xl font-bold">{movieTitle}</h2>
              </div>
            </div>
            <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-neutral-500">Ngày chiếu</dt>
                <dd className="mt-1 font-semibold">{showDate}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Giờ chiếu</dt>
                <dd className="mt-1 font-semibold">{formatTime(showtime?.GioChieu || showtime?.time)}</dd>
              </div>
              <div>
                <dt className="text-neutral-500">Phòng chiếu</dt>
                <dd className="mt-1 font-semibold">{showtime?.PhongChieu?.TenPhong || showtime?.TenPhong || 'Chưa có thông tin'}</dd>
              </div>
            </dl>
          </div>

          <div className="p-6">
            <div className="mb-5 flex min-w-0 flex-wrap justify-between gap-3 text-sm">
              <span className="min-w-0">Mã đặt vé: <strong className="break-all font-mono">{bookingResult?.MaPhieuDat || 'Chưa có'}</strong></span>
              <strong>{formatVND(bookingResult?.TongTien)}</strong>
            </div>

            {/* Single booking QR payload rendered only when success and provided by backend */}
            {isSuccess && qrPayload && (
              <div className="mb-6 flex flex-col items-center justify-center rounded-xl bg-neutral-50 p-6 border border-neutral-200 text-center">
                <QRCodeSVG
                  value={qrPayload}
                  size={160}
                  level="M"
                  title="Mã QR soát vé vào rạp"
                  className="rounded bg-white p-2 border border-neutral-200 shadow-sm"
                />
                <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Mã QR soát vé</p>
                <div className="mt-1 flex items-center justify-center gap-1.5">
                  <code className="max-w-[240px] truncate text-xs font-mono text-neutral-800 bg-white px-2.5 py-1 rounded border border-neutral-200" title={qrPayload}>
                    {qrPayload}
                  </code>
                  <button
                    type="button"
                    title="Sao chép mã QR"
                    aria-label="Sao chép mã QR đặt vé"
                    onClick={() => handleCopyCode(qrPayload)}
                    className="rounded p-1 text-neutral-600 hover:bg-neutral-200 transition-colors"
                  >
                    {copiedId === qrPayload ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  </button>
                </div>
              </div>
            )}

            {/* Plain seat details */}
            <h3 className="mb-3 font-semibold text-sm">Chi tiết ghế ({tickets.length})</h3>
            {tickets.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {tickets.map((ticket) => (
                  <article key={ticket.MaChiTietDat || ticket.seatName} className="flex flex-col gap-1.5 rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-base">Ghế {ticket.seatName}</h4>
                      <span className="font-semibold text-red-700">{formatVND(ticket.GiaVe)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span>{ticket.capacity > 1 ? `${ticket.capacity} người / ghế đôi` : 'Ghế đơn (1 người)'}</span>
                      {ticket.MaChiTietDat && <span className="font-mono">Mã vé: {ticket.MaChiTietDat}</span>}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-neutral-100 p-4 text-sm text-neutral-700">
                Chi tiết ghế chưa được trả về. Ghế đã chọn: {selectedSeats.map((seat) => seat?.TenGhe || seat).filter(Boolean).join(', ') || 'chưa có thông tin'}. Kiểm tra lại trong lịch sử đặt vé.
              </div>
            )}
          </div>
        </section>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onHome} className="rounded-xl border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold hover:bg-neutral-50">
            Về trang chủ
          </button>
          <button type="button" onClick={() => navigate('/profile', { state: { activeTab: 'upcoming' } })} className="rounded-xl bg-(--client-primary) px-5 py-3 text-sm font-semibold text-white hover:bg-(--client-primary-hover)">
            Xem vé của tôi
          </button>
        </div>
      </div>
    </main>
  );
};

export default TicketConfirmation;
