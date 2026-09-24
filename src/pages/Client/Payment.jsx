import { useEffect, useState } from 'react';
import { ArrowRight, Check, ChevronLeft, Clock3, CreditCard, Landmark, LockKeyhole, ShieldCheck, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

import { realCheckout } from '../../api/bookingApi';
import { getBookingDetail } from '../../api/bookingHistoryApi';
import { createPayOSPayment, createVNPayPayment, getPaymentGateways } from '../../api/paymentApi';
import MovieImage from '../../components/Client/MovieImage';
import PayOSModal from '../../components/payment/PayOSModal';
import { formatVND } from '../../utils/formatHelper';

const paymentOptions = [
  {
    id: 'VNPAY',
    label: 'VNPay Sandbox',
    description: 'Thẻ ATM nội địa và OTP thử nghiệm',
    badge: 'Khuyên dùng',
    icon: CreditCard,
    iconClass: 'bg-[#e21d2b] text-white',
  },
  {
    id: 'PAYOS',
    label: 'PayOS',
    description: 'Quét QR hoặc chuyển khoản ngân hàng',
    icon: Landmark,
    iconClass: 'bg-[#2f70e8] text-white',
  },
];

const Payment = ({
  movie,
  selectedDateId,
  currentSlot,
  selectedSeats,
  amount,
  formatTime,
  timeLeft = 600,
  onBack,
  onPaymentSuccess,
  maSuatChieu,
  heldSeatIds,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('VNPAY');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayOSModal, setShowPayOSModal] = useState(false);
  const [payOSData, setPayOSData] = useState(null);
  const [gatewayAvailability, setGatewayAvailability] = useState(null);

  useEffect(() => {
    let ignore = false;
    getPaymentGateways()
      .then((gateways) => {
        if (ignore) return;
        const availability = Object.fromEntries(gateways.map((gateway) => [gateway.provider, gateway.available]));
        setGatewayAvailability(availability);
        if (!availability.VNPAY && availability.PAYOS) setPaymentMethod('PAYOS');
      })
      .catch(() => { if (!ignore) setGatewayAvailability({ PAYOS: false, VNPAY: false }); });
    return () => { ignore = true; };
  }, []);

  const isGatewayAvailable = (provider) => gatewayAvailability?.[provider] === true;
  const formatTimeSeconds = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;

  const handleConfirmPayment = async () => {
    if (!maSuatChieu) return toast.error('Không tìm thấy thông tin suất chiếu!');
    if (!heldSeatIds?.length) return toast.error('Không tìm thấy danh sách ghế đang giữ!');

    setIsSubmitting(true);
    const providerLabel = paymentMethod === 'VNPAY' ? 'VNPay Sandbox' : 'PayOS';
    const toastId = toast.loading(`Đang khởi tạo giao dịch ${providerLabel}...`);
    try {
      const checkoutRes = await realCheckout({
        MaSuatChieu: maSuatChieu,
        DanhSachMaGheSuatChieu: heldSeatIds,
        PhuongThucThanhToan: paymentMethod,
      });

      if (paymentMethod === 'VNPAY') {
        const vnpayPayment = await createVNPayPayment(checkoutRes.MaPhieuDat);
        if (!vnpayPayment?.paymentUrl) throw new Error('VNPay không trả về URL thanh toán.');
        toast.dismiss(toastId);
        window.location.assign(vnpayPayment.paymentUrl);
        return;
      }

      const payosPaymentRes = await createPayOSPayment(checkoutRes.MaPhieuDat);
      toast.dismiss(toastId);
      setPayOSData(payosPaymentRes);
      setShowPayOSModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || `Không thể tạo giao dịch ${providerLabel}. Vui lòng thử lại.`);
      toast.dismiss(toastId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOSSuccess = async (statusRes) => {
    setShowPayOSModal(false);
    setIsSubmitting(true);
    const toastId = toast.loading('Đang tải chi tiết vé đặt thành công...');
    try {
      const targetPhieuDat = statusRes.maPhieuDat || payOSData?.maPhieuDat;
      const detailData = await getBookingDetail(targetPhieuDat);
      toast.dismiss(toastId);
      onPaymentSuccess(detailData, { MaPhieuDat: targetPhieuDat });
    } catch {
      toast.error('Không thể tải chi tiết mã vé từ máy chủ. Đang chuyển sang màn hình xác nhận fallback...');
      toast.dismiss(toastId);
      onPaymentSuccess(null, { MaPhieuDat: statusRes.maPhieuDat || payOSData?.maPhieuDat });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSeatLabels = selectedSeats.map((seat) => (typeof seat === 'object' ? seat.TenGhe : seat)).join(', ');
  const guestCount = selectedSeats.reduce((total, seat) => total + (typeof seat === 'object' ? Math.max(1, Number(seat.SucChua) || 1) : 1), 0);
  const movieTitle = movie?.title || movie?.TenPhim || 'Phim đang chọn';

  return (
    <div className="mx-auto w-full max-w-6xl animate-in text-left fade-in duration-500">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <button type="button" onClick={onBack} className="mb-4 flex items-center gap-1 text-xs font-bold text-neutral-500 transition-colors hover:text-neutral-950">
            <ChevronLeft size={15} /> Quay lại chọn ghế
          </button>
          <span className="text-[10px] font-black uppercase tracking-[.2em] text-(--client-primary)">Bước cuối cùng</span>
          <h1 className="mt-1 text-3xl font-extrabold tracking-[-.04em] text-neutral-950 sm:text-4xl">Xác nhận & thanh toán</h1>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-neutral-950 px-4 py-3 text-white shadow-[0_14px_30px_rgba(23,23,23,.15)]">
          <span className="grid size-9 place-items-center rounded-xl bg-white/10 text-red-400"><Clock3 size={17} /></span>
          <div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-400">Giữ ghế còn lại</small><strong className="font-mono text-lg tracking-[.08em]">{formatTimeSeconds(timeLeft)}</strong></div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.92fr)]">
        <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_50px_rgba(23,23,23,.07)] ring-1 ring-black/5 sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div><p className="text-[10px] font-black uppercase tracking-[.18em] text-neutral-400">Phương thức</p><h2 className="mt-1 text-xl font-extrabold tracking-tight text-neutral-950">Bạn muốn thanh toán thế nào?</h2></div>
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-red-50 text-(--client-primary)"><LockKeyhole size={18} /></span>
          </div>

          <div className="space-y-3">
            {paymentOptions.map((option) => {
              const available = isGatewayAvailable(option.id);
              const active = paymentMethod === option.id;
              const Icon = option.icon;
              return (
                <button
                  type="button"
                  key={option.id}
                  disabled={!available}
                  onClick={() => setPaymentMethod(option.id)}
                  className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left ring-1 transition-all duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${active ? 'bg-red-50/70 ring-red-200 shadow-[0_12px_28px_rgba(215,25,32,.08)]' : 'bg-neutral-50 ring-neutral-200 hover:-translate-y-0.5 hover:bg-white hover:ring-neutral-300'} ${available ? '' : 'cursor-not-allowed opacity-45'}`}
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${option.iconClass}`}><Icon size={21} strokeWidth={1.8} /></span>
                  <span className="min-w-0 flex-1"><span className="flex flex-wrap items-center gap-2"><strong className="text-sm text-neutral-950 sm:text-base">{option.label}</strong>{option.badge && available && <em className="rounded-full bg-white px-2 py-1 text-[8px] font-black not-italic uppercase tracking-wider text-(--client-primary) ring-1 ring-red-100">{option.badge}</em>}</span><small className="mt-1 block text-[11px] font-medium text-neutral-500">{available ? option.description : 'Cổng thanh toán chưa được cấu hình'}</small></span>
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full border transition ${active ? 'border-(--client-primary) bg-(--client-primary) text-white' : 'border-neutral-300 bg-white text-transparent'}`}><Check size={13} strokeWidth={3} /></span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-start gap-3 rounded-2xl bg-neutral-950 p-4 text-neutral-300">
            <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-[11px] leading-relaxed"><strong className="block text-xs text-white">Bạn sẽ thanh toán trên VNPay Sandbox</strong>NexCinema không lưu số thẻ hoặc mã OTP. Sau thanh toán, bạn sẽ được đưa về trang xác nhận vé.</p>
          </div>

          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isSubmitting || !isGatewayAvailable(paymentMethod)}
            className="group mt-5 flex min-h-14 w-full items-center justify-between rounded-2xl bg-(--client-primary) py-2 pl-5 pr-2 text-sm font-extrabold text-white shadow-[0_14px_30px_rgba(215,25,32,.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--client-primary-hover) disabled:cursor-not-allowed disabled:opacity-45"
          >
            <span>{isSubmitting ? 'Đang khởi tạo giao dịch…' : `Thanh toán ${formatVND(amount)}`}</span>
            <span className="grid size-10 place-items-center rounded-xl bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5"><ArrowRight size={18} /></span>
          </button>
        </section>

        <aside className="overflow-hidden rounded-[28px] bg-neutral-950 text-white shadow-[0_24px_60px_rgba(23,23,23,.18)]">
          <div className="relative h-48 overflow-hidden">
            <MovieImage movie={movie} src={movie?.poster_path || movie?.HinhAnh} alt={`Poster ${movieTitle}`} className="size-full object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/35 to-transparent" />
            <div className="absolute inset-x-5 bottom-5"><span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.14em] backdrop-blur"><Ticket size={12} /> Vé của bạn</span><h2 className="mt-3 line-clamp-2 text-2xl font-extrabold leading-tight tracking-[-.03em]">{movieTitle}</h2></div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-x-5 gap-y-5">
              <div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-500">Suất chiếu</small><strong className="mt-1 block text-sm">{formatTime(currentSlot?.GioChieu || currentSlot?.time)} · {selectedDateId}</strong></div>
              <div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-500">Phòng chiếu</small><strong className="mt-1 block text-sm">{currentSlot?.TenPhong || 'Đang cập nhật'}</strong></div>
              <div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-500">Số khách</small><strong className="mt-1 block text-sm">{guestCount} người · 2D</strong></div>
              <div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-500">Ghế</small><strong className="mt-1 block text-sm text-red-400">{selectedSeatLabels || 'Chưa chọn'}</strong></div>
            </div>

            <div className="my-6 border-t border-dashed border-white/15" />
            <div className="flex items-end justify-between gap-4"><div><small className="block text-[9px] font-bold uppercase tracking-[.14em] text-neutral-500">Tổng thanh toán</small><span className="mt-1 block text-xs text-neutral-400">Đã bao gồm phí dịch vụ</span></div><strong className="text-2xl font-black tracking-tight text-red-400">{formatVND(amount)}</strong></div>
          </div>
        </aside>
      </div>

      {payOSData && (
        <PayOSModal
          isOpen={showPayOSModal}
          onClose={() => setShowPayOSModal(false)}
          maGiaoDich={payOSData.maGiaoDich}
          qrCode={payOSData.qrCode}
          checkoutUrl={payOSData.checkoutUrl}
          orderCode={payOSData.orderCode}
          amount={payOSData.amount}
          expiresAt={payOSData.expiresAt}
          onSuccess={handlePayOSSuccess}
          onCancel={() => setShowPayOSModal(false)}
          onTimeout={() => { setShowPayOSModal(false); toast.error('Giao dịch PayOS đã hết hạn giữ ghế.'); }}
        />
      )}
    </div>
  );
};

export default Payment;
