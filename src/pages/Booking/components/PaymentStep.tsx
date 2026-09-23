import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Timer,
  QrCode,
  CreditCard,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';

import BookingProgressBar from '../../../components/common/BookingProgressBar';

import {
  getBookingDraft,
  clearBookingDraft,
  saveBookingConfirmation,
} from '@/features/booking/utils/bookingSession';

export type PaymentStatus = 'IDLE' | 'PENDING' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export const PaymentStep: React.FC = () => {
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'PAYOS' | 'VNPAY'>('VNPAY');
  const [holdTimeLeft, setHoldTimeLeft] = useState(600);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('IDLE');

  // Retrieve draft from Step 2 using bookingSession service
  const bookingDraft = React.useMemo(() => getBookingDraft(), []);

  // Restore hold timer from Step 2
  useEffect(() => {
    if (!bookingDraft) return;

    if (bookingDraft.holdTimeLeft && bookingDraft.holdStartedAt) {
      const elapsed = Math.floor((Date.now() - bookingDraft.holdStartedAt) / 1000);
      const remaining = Math.max(0, bookingDraft.holdTimeLeft - elapsed);
      setHoldTimeLeft(remaining > 0 ? remaining : 600);
    }
  }, [bookingDraft]);

  // Hold Timer countdown for Step 3
  useEffect(() => {
    const interval = setInterval(() => {
      setHoldTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // ISSUE-07 FIX: Release held seats and redirect immediately on expiry
          clearBookingDraft();
          toast.error(
            '⏰ Hết thời gian giữ ghế! Vui lòng chọn ghế lại.',
            { duration: 5000 }
          );
          navigate(ROUTES.BOOKING.CHECKOUT, { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // BR#14 & BR#15: Payment processing with mock flow
  const handleProcessPayment = () => {
    if (paymentStatus === 'PROCESSING') return;

    setPaymentStatus('PENDING');
    toast.loading('Đang khởi tạo cổng thanh toán...', { id: 'payment' });

    setTimeout(() => {
      setPaymentStatus('PROCESSING');

      if (paymentMethod === 'VNPAY') {
        // BR#14: VNPay — mock redirect flow
        toast.loading('Đang chuyển hướng tới VNPay...', { id: 'payment' });
        setTimeout(() => {
          toast.dismiss('payment');
          setPaymentStatus('SUCCESS');
          // Save confirmation data using domain session helper
          saveBookingConfirmation({
            orderCode: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
            movieTitle: bookingDraft?.movieTitle || 'Dune: Hành Tinh Cát - Phần 2',
            formatText: bookingDraft?.formatText || '2D IMAX Laser',
            cinemaName: 'NexCinema Complex Lê Duẩn',
            roomName: bookingDraft?.roomName || 'Phòng chiếu IMAX Laser (Tầng 4)',
            showtime: `${bookingDraft?.showtimeTime || '11:30'} - ${bookingDraft?.showtimeDate || 'Thứ Ba, 29/10/2024'}`,
            seats: bookingDraft?.seats || ['J4', 'J5'],
            paymentMethod: 'VNPAY (Cổng VNPAY-QR)',
            paymentStatus: 'ĐÃ THANH TOÁN',
            totalAmount: bookingDraft?.totalAmount || 220000,
            createdDate: new Date().toLocaleDateString('vi-VN'),
          });
          toast.success('Thanh toán VNPay thành công!');
          navigate(ROUTES.BOOKING.CONFIRMATION);
        }, 2000);
      } else {
        // BR#15: PayOS — mock QR + polling flow
        toast.loading('Đang tạo mã QR thanh toán PayOS...', { id: 'payment' });
        setTimeout(() => {
          toast.dismiss('payment');
          toast.success('Quét QR thành công! Đang xác nhận giao dịch...');
          setPaymentStatus('SUCCESS');
          saveBookingConfirmation({
            orderCode: `NEX-${Math.floor(100000 + Math.random() * 900000)}`,
            movieTitle: bookingDraft?.movieTitle || 'Dune: Hành Tinh Cát - Phần 2',
            formatText: bookingDraft?.formatText || '2D IMAX Laser',
            cinemaName: 'NexCinema Complex Lê Duẩn',
            roomName: bookingDraft?.roomName || 'Phòng chiếu IMAX Laser (Tầng 4)',
            showtime: `${bookingDraft?.showtimeTime || '11:30'} - ${bookingDraft?.showtimeDate || 'Thứ Ba, 29/10/2024'}`,
            seats: bookingDraft?.seats || ['J4', 'J5'],
            paymentMethod: 'PayOS (Quét mã QR Ngân hàng)',
            paymentStatus: 'ĐÃ THANH TOÁN',
            totalAmount: bookingDraft?.totalAmount || 220000,
            createdDate: new Date().toLocaleDateString('vi-VN'),
          });
          navigate(ROUTES.BOOKING.CONFIRMATION);
        }, 3000);
      }
    }, 800);
  };

  // BR#22: Back from payment → release held seats (mock)
  const handleBackFromPayment = () => {
    toast.success('Đã hủy giữ ghế. Quay lại chọn ghế.');
    clearBookingDraft();
    navigate(ROUTES.BOOKING.CHECKOUT);
  };

  const seatsList = bookingDraft?.seats || ['J4', 'J5'];
  const totalAmount = bookingDraft?.totalAmount || 220000;

  return (
    <div className="w-full bg-[#f5f3f3] text-[#1b1c1c] min-h-screen pb-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* STEPPER BAR STEP 3 */}
        <BookingProgressBar currentStep={3} />

        {/* MAIN 2-COLUMN PAYMENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: PAYMENT METHOD OPTIONS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#e4e2e2] flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-black text-[#1b1c1c]">Phương thức thanh toán</h2>
                <p className="text-xs text-[#5f5e5e] mt-1">
                  Chọn cổng thanh toán tiện lợi và an toàn để hoàn tất đơn đặt vé của bạn.
                </p>
              </div>

              {/* PAYMENT OPTIONS SELECTOR */}
              <div className="flex flex-col gap-4">
                {/* Option 1: PayOS */}
                <div
                  onClick={() => paymentStatus === 'IDLE' && setPaymentMethod('PAYOS')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'PAYOS'
                      ? 'border-[#d71920] bg-red-50/20 ring-1 ring-[#d71920]'
                      : 'border-[#e4e2e2] bg-[#f5f3f3] hover:bg-[#e4e2e2]'
                  } ${paymentStatus !== 'IDLE' ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-[#d71920] flex items-center justify-center">
                    {paymentMethod === 'PAYOS' && (
                      <div className="w-2 h-2 rounded-full bg-[#d71920]" />
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#e4e2e2] flex items-center justify-center text-[#d71920] shrink-0">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1c1c]">
                      PayOS – Quét mã QR Ngân hàng (VietQR)
                    </p>
                    <p className="text-xs text-[#5f5e5e]">
                      Tự động xác nhận giao dịch qua mã QR ngân hàng
                    </p>
                  </div>
                </div>

                {/* Option 2: VNPay */}
                <div
                  onClick={() => paymentStatus === 'IDLE' && setPaymentMethod('VNPAY')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'VNPAY'
                      ? 'border-[#d71920] bg-red-50/20 ring-1 ring-[#d71920]'
                      : 'border-[#e4e2e2] bg-[#f5f3f3] hover:bg-[#e4e2e2]'
                  } ${paymentStatus !== 'IDLE' ? 'opacity-60 pointer-events-none' : ''}`}
                >
                  <div className="w-4 h-4 rounded-full border-2 border-[#d71920] flex items-center justify-center">
                    {paymentMethod === 'VNPAY' && (
                      <div className="w-2 h-2 rounded-full bg-[#d71920]" />
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#e4e2e2] flex items-center justify-center text-[#00588f] shrink-0">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#1b1c1c]">
                      VNPAY – Thẻ ATM / VNPAY-QR / Thẻ Quốc tế
                    </p>
                    <p className="text-xs text-[#5f5e5e]">
                      Cổng thanh toán bảo mật VNPAY (ATM, Visa, MasterCard)
                    </p>
                  </div>
                </div>

                {/* BR#21: Payment Status Indicator */}
                {paymentStatus !== 'IDLE' && (
                  <div
                    className={`p-4 rounded-xl border flex items-center gap-3 ${
                      paymentStatus === 'SUCCESS'
                        ? 'border-emerald-300 bg-emerald-50'
                        : paymentStatus === 'FAILED'
                        ? 'border-red-300 bg-red-50'
                        : 'border-[#e4e2e2] bg-[#f5f3f3]'
                    }`}
                  >
                    {(paymentStatus === 'PENDING' || paymentStatus === 'PROCESSING') && (
                      <Loader2 className="w-5 h-5 text-[#d71920] animate-spin shrink-0" />
                    )}
                    {paymentStatus === 'SUCCESS' && (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    <div>
                      <p className="font-bold text-sm text-[#1b1c1c]">
                        {paymentStatus === 'PENDING' && 'Đang khởi tạo giao dịch...'}
                        {paymentStatus === 'PROCESSING' &&
                          (paymentMethod === 'VNPAY'
                            ? 'Đang xử lý thanh toán qua VNPay...'
                            : 'Đang chờ quét mã QR PayOS...')}
                        {paymentStatus === 'SUCCESS' && 'Thanh toán thành công!'}
                        {paymentStatus === 'FAILED' && 'Thanh toán thất bại!'}
                      </p>
                      <p className="text-xs text-[#5f5e5e] mt-0.5">
                        {paymentStatus === 'PROCESSING' && paymentMethod === 'PAYOS' &&
                          'Mở ứng dụng ngân hàng và quét mã QR để thanh toán'}
                        {paymentStatus === 'FAILED' &&
                          'Vui lòng thử lại hoặc chọn phương thức thanh toán khác'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Security statement */}
                <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#e4e2e2] text-xs text-[#5f5e5e] space-y-1">
                  <p className="font-bold text-[#1b1c1c]">
                    (*) Quy định giao dịch: Bằng việc nhấn THANH TOÁN, bạn xác nhận đã đọc, hiểu rõ và đồng ý với các Quy định & Điều khoản giao dịch của NexCinema. Vé đã thanh toán thành công không hỗ trợ hoàn tiền hoặc thay đổi suất chiếu.
                  </p>
                  <div className="flex items-center gap-4 pt-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-[#d71920]" /> Kết nối mã hoá SSL 256-bit
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#d71920]" /> Chứng chỉ bảo mật PCI DSS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (4 COLS) */}
          <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e4e2e2]">
              <div className="p-6 flex flex-col gap-5">
                {/* Timer Header */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5f5e5e] uppercase">
                    Thời gian giữ vé:
                  </span>
                  {/* ISSUE-08 FIX: Urgent visual states for timer < 2min / < 30s */}
                  {(() => {
                    const isCritical = holdTimeLeft < 30;
                    const isUrgent = holdTimeLeft < 120;
                    return (
                      <div
                        className={`flex items-center gap-1 px-3 py-1 rounded-full font-black text-sm border transition-all ${
                          isCritical
                            ? 'bg-red-600 text-white border-red-700 animate-pulse'
                            : isUrgent
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-red-50 text-[#d71920] border-red-200'
                        }`}
                      >
                        <Timer className={`w-4 h-4 ${isCritical ? 'animate-spin' : ''}`} />
                        <span>{formatTimer(holdTimeLeft)}</span>
                      </div>
                    );
                  })()}
                </div>

                {/* Movie Info */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f5f3f3]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw"
                    alt="Dune 2"
                    className="w-14 h-20 rounded object-cover flex-shrink-0 shadow-xs"
                  />
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="px-1.5 py-0.5 rounded bg-[#d71920] text-white font-bold text-[10px]">
                        C16
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#e4e2e2] text-[#1b1c1c] font-semibold text-[10px]">
                        2D IMAX Laser
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#1b1c1c] line-clamp-2">
                      {bookingDraft?.movieTitle || 'Dune: Hành Tinh Cát - Phần 2'}
                    </h3>
                    <p className="text-[11px] text-[#5f5e5e] mt-1">166 phút</p>
                  </div>
                </div>

                {/* Cinema & Showtime details */}
                <div className="p-3 rounded-lg bg-[#f5f3f3] space-y-1 text-xs">
                  <p className="font-bold text-[#1b1c1c]">NexCinema Complex Lê Duẩn</p>
                  <p className="text-[#5f5e5e]">
                    {bookingDraft?.roomName || 'Phòng chiếu IMAX Laser'} (Tầng 4)
                  </p>
                  <p className="font-bold text-[#d71920] pt-1">
                    {bookingDraft?.showtimeTime || '11:30'} -{' '}
                    {bookingDraft?.showtimeDate || 'Thứ Ba, 29/10/2024'}
                  </p>
                </div>

                {/* Itemized pricing */}
                <div className="space-y-1.5 text-xs text-[#5f5e5e] pt-2 border-t border-[#e4e2e2]">
                  <div className="flex justify-between">
                    <span>Loại vé & Vị trí ghế:</span>
                    <strong className="text-[#1b1c1c]">
                      {seatsList.length}x Ghế ({seatsList.join(', ')})
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tổng tạm tính:</span>
                    <strong className="text-[#1b1c1c]">
                      {totalAmount.toLocaleString('vi-VN')} đ
                    </strong>
                  </div>
                </div>

                <div className="w-full h-px bg-[#e4e2e2]" />

                {/* Total */}
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#5f5e5e]">Tổng cộng</span>
                  <span className="text-2xl font-black text-[#d71920]">
                    {totalAmount.toLocaleString('vi-VN')} đ
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  onClick={handleProcessPayment}
                  disabled={paymentStatus !== 'IDLE'}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all ${
                    paymentStatus === 'IDLE'
                      ? 'bg-[#d71920] hover:bg-[#ae0011] text-white active:scale-[0.98] cursor-pointer'
                      : 'bg-[#e4e2e2] text-[#5f5e5e] cursor-not-allowed'
                  }`}
                >
                  {paymentStatus !== 'IDLE' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Thanh toán ngay ({totalAmount.toLocaleString('vi-VN')} đ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* BR#22: Back button releases held seats */}
                <button
                  onClick={handleBackFromPayment}
                  disabled={paymentStatus !== 'IDLE'}
                  className="text-center text-xs font-semibold text-[#5f5e5e] hover:text-[#d71920] transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Quay lại chọn ghế (hủy giữ ghế)</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;
