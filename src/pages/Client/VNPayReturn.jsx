import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertCircle, ArrowRight, Check, Home, Loader2, RefreshCw, ShieldCheck, User, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { getBookingDetail } from '../../api/bookingHistoryApi';
import { getVNPayPaymentStatus } from '../../api/paymentApi';
import TicketConfirmation from './TicketConfirmation';
import { formatShowtimeTime } from '../../utils/showtimeHelper';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 15;

const VNPayReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const maGiaoDich = searchParams.get('maGiaoDich');
  const returnStatus = searchParams.get('status');
  const [statusState, setStatusState] = useState(() => (maGiaoDich && returnStatus !== 'failed' ? 'polling' : 'failed'));
  const [bookingDetail, setBookingDetail] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;

    if (!maGiaoDich) {
      toast.error('Không tìm thấy mã giao dịch VNPay.');
      return () => {};
    }
    if (returnStatus === 'failed') return () => {};

    const pollStatus = async (attempt) => {
      try {
        const paymentStatus = await getVNPayPaymentStatus(maGiaoDich);
        if (cancelled) return;

        if (paymentStatus.status === 'THANH_CONG') {
          const detail = await getBookingDetail(paymentStatus.maPhieuDat);
          if (cancelled) return;
          setBookingDetail(detail);
          setStatusState('success');
          toast.success('Thanh toán VNPay Sandbox thành công!');
          return;
        }

        if (paymentStatus.status === 'THAT_BAI') {
          setStatusState('failed');
          return;
        }
      } catch {
        // Network and propagation delays are retried within the polling window.
      }

      if (attempt >= MAX_POLL_ATTEMPTS) {
        setStatusState('timeout');
        return;
      }
      timeoutId = window.setTimeout(() => pollStatus(attempt + 1), POLL_INTERVAL_MS);
    };

    pollStatus(1);
    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [maGiaoDich, retryKey, returnStatus]);

  if (statusState === 'success' && bookingDetail) {
    const firstTicket = bookingDetail.ChiTietDatVes?.[0];
    const showtime = firstTicket?.SuatChieu;
    const selectedDateId = showtime?.NgayChieu ? new Date(showtime.NgayChieu).toLocaleDateString('vi-VN') : '';

    return (
      <TicketConfirmation
        movie={showtime?.Phim}
        selectedDateId={selectedDateId}
        currentSlot={showtime}
        selectedSeats={bookingDetail.ChiTietDatVes?.map((ticket) => ticket.Ghe) || []}
        formatTime={formatShowtimeTime}
        bookingResult={bookingDetail}
        onHome={() => navigate('/')}
      />
    );
  }

  const isPolling = statusState === 'polling';
  const isFailed = statusState === 'failed';
  const title = isPolling ? 'Đang xác nhận giao dịch' : isFailed ? 'Thanh toán chưa hoàn tất' : 'Cần thêm một lần kiểm tra';
  const description = isPolling
    ? 'VNPay đã đưa bạn trở lại NexCinema. Hệ thống đang đối chiếu chữ ký và cập nhật vé.'
    : isFailed
      ? 'Giao dịch bị hủy hoặc VNPay trả về kết quả không thành công. Ghế sẽ được mở lại theo thời hạn giữ.'
      : 'Kết quả chưa kịp đồng bộ trong lần kiểm tra đầu tiên. Bạn có thể kiểm tra lại ngay mà không cần thanh toán lần nữa.';

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#f4f1f1] p-5 text-left">
      <div className="absolute -left-24 top-1/3 size-72 rounded-full bg-red-200/35 blur-3xl" />
      <div className="absolute -right-24 bottom-0 size-80 rounded-full bg-neutral-300/50 blur-3xl" />

      <section className="relative w-full max-w-xl overflow-hidden rounded-[32px] bg-white shadow-[0_32px_90px_rgba(23,23,23,.14)] ring-1 ring-black/5">
        <div className="bg-neutral-950 px-6 py-7 text-white sm:px-8">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-400"><ShieldCheck size={15} className="text-emerald-400" /> VNPay Sandbox</span>
            <span className="font-mono text-[10px] text-neutral-500">{maGiaoDich?.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="mt-8 flex items-start gap-4">
            {isPolling ? (
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-red-500/15 text-red-400"><Loader2 className="animate-spin" size={28} /></span>
            ) : isFailed ? (
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-red-500/15 text-red-400"><XCircle size={28} /></span>
            ) : (
              <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-amber-500/15 text-amber-400"><AlertCircle size={28} /></span>
            )}
            <div><p className="text-[9px] font-black uppercase tracking-[.18em] text-red-400">Trạng thái thanh toán</p><h1 className="mt-1 text-2xl font-extrabold tracking-[-.03em]">{title}</h1><p className="mt-3 text-xs leading-relaxed text-neutral-400">{description}</p></div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-[24px_1fr] gap-x-3 gap-y-0">
            <span className="grid size-6 place-items-center rounded-full bg-emerald-500 text-white"><Check size={13} strokeWidth={3} /></span>
            <div className="border-l border-neutral-200 pb-6 pl-4"><strong className="block text-xs text-neutral-950">Đã trở về từ VNPay</strong><small className="mt-1 block text-[11px] text-neutral-500">Thông tin phản hồi đã được ký bởi cổng thanh toán.</small></div>
            <span className={`grid size-6 place-items-center rounded-full ${isPolling ? 'bg-(--client-primary) text-white' : isFailed ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{isPolling ? <Loader2 size={13} className="animate-spin" /> : <AlertCircle size={13} />}</span>
            <div className="pl-4"><strong className="block text-xs text-neutral-950">Đối chiếu và phát hành vé</strong><small className="mt-1 block text-[11px] text-neutral-500">{isPolling ? 'Đang xử lý, thường chỉ mất vài giây.' : 'Chưa có kết quả cuối cùng cho giao dịch này.'}</small></div>
          </div>

          {!isPolling && (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {!isFailed && (
                <button type="button" onClick={() => { setStatusState('polling'); setRetryKey((value) => value + 1); }} className="group flex min-h-12 items-center justify-between rounded-xl bg-(--client-primary) px-4 text-xs font-extrabold text-white transition hover:bg-(--client-primary-hover)">
                  Kiểm tra lại <span className="grid size-7 place-items-center rounded-lg bg-white/15"><RefreshCw size={14} /></span>
                </button>
              )}
              <button type="button" onClick={() => navigate('/profile', { state: { activeTab: 'upcoming' } })} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100">
                <User size={15} /> Lịch sử đặt vé
              </button>
              <button type="button" onClick={() => navigate('/')} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 text-xs font-bold text-neutral-700 transition hover:bg-neutral-50 ${isFailed ? 'sm:col-span-2' : ''}`}>
                <Home size={15} /> Về trang chủ <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default VNPayReturn;
