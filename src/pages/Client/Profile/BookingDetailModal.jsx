import { useEffect, useRef } from 'react';
import { Check, Copy, RotateCcw, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

import { formatVND, formatDateTime } from '../../../utils/formatHelper';
import { formatShowtimeTime, getShowtimeStartFromBooking } from '../../../utils/showtimeHelper';
import { getBookingStatusLabel, getTransactionStatusLabel, getRefundStatusLabel } from '../../../utils/statusHelper';

const BookingDetailModal = ({
  isOpen,
  detailLoading,
  bookingDetail,
  refundRequests,
  copiedTicketId,
  onClose,
  onCopyTicketId,
  onCancelBooking,
  onRefundRequest,
}) => {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onCloseRef.current();
      if (event.key !== 'Tab') return;
      const focusable = dialogRef.current?.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) { event.preventDefault(); dialogRef.current?.focus(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      else if (!dialogRef.current?.contains(document.activeElement)) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = previousOverflow; previousFocus?.focus?.(); };
  }, [isOpen]);

  if (!isOpen) return null;

  const now = new Date();
  const isCheckedIn = Boolean(bookingDetail?.DaCheckIn);
  const checkInTime = bookingDetail?.ThoiGianCheckIn ? formatDateTime(bookingDetail.ThoiGianCheckIn) : null;
  const qrPayload = bookingDetail?.QRPayload;

  const detailShowtimeStart = bookingDetail ? getShowtimeStartFromBooking(bookingDetail) : null;
  const detailIsFuture = detailShowtimeStart && detailShowtimeStart >= now;
  const detailRefundReq = bookingDetail ? refundRequests.find(r => r.PhieuDatVe?.MaPhieuDat === bookingDetail.MaPhieuDat) : null;
  const detailHasRefundRecord = !!detailRefundReq;

  // After check-in, do not offer cancellation or refund controls
  const detailCanCancel = !isCheckedIn && bookingDetail && bookingDetail.TrangThai === 'DA_THANH_TOAN' && detailIsFuture && !detailHasRefundRecord;
  const detailCanRequestRefund = !isCheckedIn && bookingDetail && bookingDetail.TrangThai === 'DA_HUY' && detailIsFuture && !detailHasRefundRecord;

  const tickets = bookingDetail?.ChiTietDatVes || [];
  const showtime = tickets[0]?.SuatChieu;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="booking-detail-title" tabIndex={-1} className="relative max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 text-neutral-900 shadow-2xl outline-none sm:p-8">
        <button type="button" onClick={onClose} title="Đóng" aria-label="Đóng chi tiết đặt vé" className="absolute right-4 top-4 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100"><X size={20} /></button>
        {detailLoading || !bookingDetail ? (
          <div className="py-20 text-center text-sm text-neutral-600">Đang tải chi tiết đặt vé…</div>
        ) : (
          <>
            <header className="border-b border-neutral-200 pb-5 pr-10">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-red-700">Chi tiết đặt vé</p>
                {isCheckedIn ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    Đã soát vé {checkInTime ? `· ${checkInTime}` : ''}
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 border border-neutral-200">
                    Chưa soát vé
                  </span>
                )}
              </div>
              <h2 id="booking-detail-title" className="mt-1 text-2xl font-bold">{showtime?.Phim?.TenPhim || 'Thông tin vé'}</h2>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
                <span>Ngày: {showtime?.NgayChieu ? new Date(showtime.NgayChieu).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}</span>
                <span>Giờ: {formatShowtimeTime(showtime?.GioChieu)}</span>
                <span>Phòng: {showtime?.PhongChieu?.TenPhong || 'Chưa có thông tin'}</span>
              </div>
            </header>

            <div className="mt-6 grid gap-6 md:grid-cols-[1.2fr_.8fr]">
              {/* Plain Seat List */}
              <div>
                <h3 className="mb-3 font-semibold">Danh sách ghế ({tickets.length})</h3>
                {tickets.length ? (
                  <div className="space-y-3">
                    {tickets.map((ticket) => (
                      <article key={ticket.MaChiTietDat || ticket.Ghe?.TenGhe} className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4">
                        <div className="flex min-w-0 items-center justify-between gap-3">
                          <strong className="min-w-0 break-words text-base font-bold">Ghế {ticket.Ghe?.TenGhe || 'Chưa rõ'}</strong>
                          <strong className="shrink-0 text-red-700 font-semibold">{formatVND(ticket.GiaVe)}</strong>
                        </div>
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                          <span>{Number(ticket.Ghe?.SucChua || ticket.SucChua || 1) > 1 ? `${ticket.Ghe?.SucChua || ticket.SucChua} người / ghế đôi` : 'Ghế đơn (1 người)'}</span>
                          <span className="text-xs text-neutral-400 font-mono">Mã vé: {ticket.MaChiTietDat || '--'}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-xl bg-neutral-100 p-4 text-sm">Chưa có chi tiết ghế đặt.</p>
                )}
              </div>

              {/* Invoice & Single Booking QR */}
              <aside className="rounded-xl border border-neutral-200 p-4 flex flex-col gap-5">
                {/* Booking QR Code - rendered only when backend provides QRPayload */}
                {qrPayload && (
                  <div className="flex flex-col items-center rounded-xl bg-neutral-50 p-4 border border-neutral-200 text-center">
                    <QRCodeSVG
                      value={qrPayload}
                      size={150}
                      level="M"
                      title="Mã QR soát vé vào rạp"
                      className="rounded bg-white p-2 border border-neutral-200 shadow-sm"
                    />
                    <div className="mt-3 w-full">
                      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Mã QR soát vé</p>
                      <div className="mt-1 flex items-center justify-center gap-1.5">
                        <code className="max-w-[180px] truncate text-xs font-mono text-neutral-700 bg-white px-2 py-0.5 rounded border border-neutral-200" title={qrPayload}>
                          {qrPayload}
                        </code>
                        <button
                          type="button"
                          title="Sao chép mã QR"
                          aria-label="Sao chép mã QR"
                          onClick={() => onCopyTicketId?.(qrPayload)}
                          className="rounded p-1 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          {copiedTicketId === qrPayload ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold">Thông tin hóa đơn</h3>
                  <dl className="mt-3 space-y-2.5 text-sm">
                    <div>
                      <dt className="text-neutral-500">Mã đặt vé</dt>
                      <dd className="mt-0.5 break-all font-mono font-medium">{bookingDetail.MaPhieuDat}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Ngày lập phiếu</dt>
                      <dd className="mt-0.5">{formatDateTime(bookingDetail.NgayTao)}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Trạng thái đặt vé</dt>
                      <dd className="mt-0.5">{getBookingStatusLabel(bookingDetail.TrangThai).text}</dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Trạng thái soát vé</dt>
                      <dd className="mt-0.5">
                        {isCheckedIn ? (
                          <span className="font-semibold text-emerald-700">Đã check-in ({checkInTime || 'Vừa xong'})</span>
                        ) : (
                          <span className="text-neutral-600">Chưa soát vé</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-neutral-500">Tổng tiền</dt>
                      <dd className="mt-0.5 text-lg font-bold text-red-700">{formatVND(bookingDetail.TongTien)}</dd>
                    </div>
                  </dl>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <h4 className="font-semibold text-sm">Giao dịch</h4>
                  {bookingDetail.GiaoDichs?.length ? (
                    bookingDetail.GiaoDichs.map((tx) => (
                      <div key={tx.MaGiaoDich} className="mt-2 text-sm">
                        <p>{tx.PhuongThuc?.toUpperCase() || 'Thanh toán'} · {getTransactionStatusLabel(tx.TrangThai).text}</p>
                        <p className="text-neutral-500 text-xs">{formatDateTime(tx.NgayGiaoDich)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="mt-1 text-sm text-neutral-500">Chưa có thông tin giao dịch.</p>
                  )}
                </div>

                {detailRefundReq && (
                  <div className="border-t border-neutral-200 pt-4 text-sm">
                    <h4 className="font-semibold">Hoàn tiền</h4>
                    <p className="mt-1">{getRefundStatusLabel(detailRefundReq.TrangThai).text} · {formatVND(detailRefundReq.SoTienHoan)}</p>
                    <p className="mt-0.5 text-neutral-500 text-xs">{detailRefundReq.LyDo || 'Không có lý do'}</p>
                  </div>
                )}
              </aside>
            </div>

            {(detailCanCancel || detailCanRequestRefund) && (
              <footer className="mt-6 flex justify-end border-t border-neutral-200 pt-5">
                {detailCanCancel && (
                  <button type="button" onClick={() => onCancelBooking(bookingDetail.MaPhieuDat)} className="rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 transition-colors">
                    <X size={15} className="mr-2 inline" />Hủy vé &amp; hoàn tiền
                  </button>
                )}
                {detailCanRequestRefund && (
                  <button type="button" onClick={() => onRefundRequest(bookingDetail.MaPhieuDat)} className="rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white hover:bg-amber-700 transition-colors">
                    <RotateCcw size={15} className="mr-2 inline" />Yêu cầu hoàn tiền
                  </button>
                )}
              </footer>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default BookingDetailModal;
