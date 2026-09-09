import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Store,
  Calendar,
  Ticket,
  ShieldCheck,
  Lock,
  Timer,
  QrCode,
  CreditCard,
  Film,
} from 'lucide-react';
import toast from 'react-hot-toast';

import BookingProgressBar from '../../components/common/BookingProgressBar';

interface MovieOption {
  id: string;
  title: string;
  posterUrl: string;
}

const MOVIES_LIST: MovieOption[] = [
  {
    id: 'dune2',
    title: 'Dune: Hành Tinh Cát - Phần 2',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw',
  },
  {
    id: 'hope',
    title: 'Hope: Vùng Tử Địa',
    posterUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'godzilla',
    title: 'Godzilla x Kong: Đế Chế Mới',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCJorOGi6KDI5vPAzSKvI2Yg-Akq-cHHn8gJxHIGv-nbfHaGm3LceKdC5MgCwOc3BJ3sCUiG98jVgZo9uykKxsjWVLeSJSXzbmtiySeLfHUznIKaO7SrzMidOX_oH-zslozH__r71_HshWFSbDz4yBmn4TwFTGEOKu7pgmk5t5B0B0i9epnLJOIZLJJkYTSjfDzB_SPBqAWSRZMFyUyS3yfaCprNK6NnNkx0tmNFOBbJy2nUpmmCp3Kpg',
  },
  {
    id: 'latmat7',
    title: 'Lật Mặt 7: Một Điều Ước',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQApIsluMZkKbasRzODxDYeMICC7Hn32qSpVKicnUVan2QN8PYUi4widx9PygF4tNg5DKjHPabXGQWY8C1RMD02AcJda1m2OkLKHxCILUpwPQhkN6zsQjkZ0BLFKlo_jaSFvxiXouCMS2l1TXQESY0sBsR3DDi2X-vfORjYed0gusqndXQmA3c0y8ARV01bFLdTbYlUrptKsEYRrY7cfd78QFxzysFbVrDHB_Hfunsa-byhGCIu3BTtw',
  },
  {
    id: 'kungfupanda',
    title: 'Kung Fu Panda 4',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EOuVahVJi3kOUG70NMtD3MIwfQmtweFx0gsQOvwT0PBBNj9nIVTv4egOfGBVZyQP4FmdudSWXfcP5jgURMrYNAzQmIpP9CZHW3RKHM24IPBfUx738RhY2DOgSkVHLCxmxFMAZ1XHID82l9pXYuFPrQILY38Ysi1b4sUrkUPGGmG5jOTGhey31l1IwOQM5-FIsFY0ZaClKDtrCG7VL93E3se1bY4ym0JSSw4p3DSpwJurP_GG32ORDQ',
  },
];

const SHOWTIME_TIMES = ['10:45', '11:30', '13:00', '14:45', '18:15', '21:00'];

export const Checkout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isPaymentStep = location.pathname.includes('/payment');

  // ── Step 1 States (Select Movie & Showtime) ────────────────────────
  const [isMovieDropdownOpen, setIsMovieDropdownOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieOption | null>(null);
  const [isShowtimeDropdownOpen, setIsShowtimeDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Hôm nay, 29/10/2024');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // ── Step 3 States (Payment Method) ─────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState<'PAYOS' | 'VNPAY'>('VNPAY');
  const [holdTimeLeft, setHoldTimeLeft] = useState(437); // 7 mins 17 secs hold countdown

  // Retrieve draft from Step 2
  const bookingDraft = React.useMemo(() => {
    try {
      const saved = sessionStorage.getItem('booking_draft');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  // Hold Timer for Step 3
  useEffect(() => {
    if (!isPaymentStep) return;
    const interval = setInterval(() => {
      setHoldTimeLeft((prev) => (prev <= 1 ? 600 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaymentStep]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── Handlers ──────────────────────────────────────────────────────
  const handleSelectMovie = (movie: MovieOption) => {
    setSelectedMovie(movie);
    setIsMovieDropdownOpen(false);
    setIsShowtimeDropdownOpen(true); // Auto expand showtime dropdown
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setIsShowtimeDropdownOpen(false);
  };

  const handleProceedToSeatSelection = () => {
    if (!selectedMovie || !selectedTime) {
      toast.error('Vui lòng chọn phim và suất chiếu!');
      return;
    }
    navigate('/booking/st-11:30');
  };

  const handleProcessPayment = () => {
    toast.loading('Đang khởi tạo cổng thanh toán...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Thanh toán đơn hàng thành công!');
      navigate('/booking/confirmation');
    }, 1200);
  };

  // ── RENDER STEP 3 (THANH TOÁN) ────────────────────────────────────
  if (isPaymentStep) {
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

                {/* Option 1: PayOS */}
                <div
                  onClick={() => setPaymentMethod('PAYOS')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'PAYOS'
                      ? 'border-[#d71920] bg-red-50/20 ring-1 ring-[#d71920]'
                      : 'border-[#e4e2e2] bg-[#f5f3f3] hover:bg-[#e4e2e2]'
                  }`}
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
                  onClick={() => setPaymentMethod('VNPAY')}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                    paymentMethod === 'VNPAY'
                      ? 'border-[#d71920] bg-red-50/20 ring-1 ring-[#d71920]'
                      : 'border-[#e4e2e2] bg-[#f5f3f3] hover:bg-[#e4e2e2]'
                  }`}
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

            {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (4 COLS) */}
            <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
              <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e4e2e2]">
                <div className="p-6 flex flex-col gap-5">
                  {/* Timer Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#5f5e5e] uppercase">
                      Thời gian giữ vé:
                    </span>
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-[#d71920] font-black text-sm border border-red-200">
                      <Timer className="w-4 h-4" />
                      <span>{formatTimer(holdTimeLeft)}</span>
                    </div>
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
                        Dune: Hành Tinh Cát - Phần 2
                      </h3>
                      <p className="text-[11px] text-[#5f5e5e] mt-1">166 phút</p>
                    </div>
                  </div>

                  {/* Cinema & Showtime details */}
                  <div className="p-3 rounded-lg bg-[#f5f3f3] space-y-1 text-xs">
                    <p className="font-bold text-[#1b1c1c]">NexCinema Complex Lê Duẩn</p>
                    <p className="text-[#5f5e5e]">Phòng chiếu IMAX Laser (Tầng 4)</p>
                    <p className="font-bold text-[#d71920] pt-1">
                      11:30 - Thứ Ba, 29/10/2024
                    </p>
                  </div>

                  {/* Itemized pricing */}
                  <div className="space-y-1.5 text-xs text-[#5f5e5e] pt-2 border-t border-[#e4e2e2]">
                    <div className="flex justify-between">
                      <span>Loại vé & Vị trí ghế:</span>
                      <strong className="text-[#1b1c1c]">{seatsList.length}x Ghế VIP ({seatsList.join(', ')})</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Đơn giá vé:</span>
                      <span>110.000 đ x {seatsList.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng tạm tính:</span>
                      <strong className="text-[#1b1c1c]">{totalAmount.toLocaleString('vi-VN')} đ</strong>
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
                    className="w-full py-3.5 px-4 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Thanh toán ngay ({totalAmount.toLocaleString('vi-VN')} đ)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    to="/booking/st-11:30"
                    className="text-center text-xs font-semibold text-[#5f5e5e] hover:text-[#d71920] transition-colors flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Quay lại chọn ghế</span>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    );
  }

  // ── RENDER STEP 1 (CHỌN PHIM & SUẤT CHIẾU) ────────────────────────
  return (
    <div className="w-full bg-[#f5f3f3] text-[#1b1c1c] min-h-screen pb-16">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-6">
        {/* STEPPER BAR STEP 1 */}
        <BookingProgressBar currentStep={1} />

        {/* MAIN 2-COLUMN WIZARD LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: 2 ACCORDION SELECTOR BARS (8 COLS) */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* THANH 1: CHỌN PHIM */}
            <div className="w-full flex flex-col relative">
              <div
                onClick={() => setIsMovieDropdownOpen(!isMovieDropdownOpen)}
                className="w-full bg-white rounded-2xl border border-[#e4e2e2] shadow-sm px-6 py-4 flex items-center justify-between cursor-pointer hover:border-gray-400 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {selectedMovie ? (
                    <>
                      <img
                        src={selectedMovie.posterUrl}
                        alt={selectedMovie.title}
                        className="w-8 h-11 rounded object-cover shadow-xs shrink-0"
                      />
                      <span className="font-bold text-sm text-[#171717] truncate">
                        {selectedMovie.title}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-sm text-[#171717]">Chọn phim</span>
                  )}
                </div>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#f5f3f3] text-[#334155] flex items-center justify-center hover:bg-[#e4e2e2] transition-colors shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isMovieDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Movie Dropdown List */}
              {isMovieDropdownOpen && (
                <div className="mt-2 w-full bg-white rounded-2xl border border-[#e4e2e2] shadow-xl p-3 flex flex-col gap-2 z-20 animate-in fade-in duration-150">
                  {MOVIES_LIST.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleSelectMovie(m)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f5f3f3] cursor-pointer transition-colors"
                    >
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="w-14 h-20 rounded-lg object-cover shrink-0 shadow-xs"
                      />
                      <span className="font-bold text-sm text-[#1b1c1c]">{m.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* THANH 2: CHỌN SUẤT */}
            <div className="w-full flex flex-col relative">
              <div
                onClick={() => {
                  if (selectedMovie) setIsShowtimeDropdownOpen(!isShowtimeDropdownOpen);
                }}
                className={`w-full bg-white rounded-2xl border border-[#e4e2e2] shadow-sm px-6 py-4 flex items-center justify-between transition-all ${
                  selectedMovie
                    ? 'cursor-pointer hover:border-gray-400 hover:shadow-md'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {selectedTime ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d71920]" />
                      <span className="font-bold text-sm text-[#171717]">{selectedTime}</span>
                      <span className="text-xs text-[#5f5e5e]">({selectedDate})</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-sm text-[#171717]">Chọn suất</span>
                  )}
                </div>
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-[#f5f3f3] text-[#334155] flex items-center justify-center hover:bg-[#e4e2e2] transition-colors shrink-0"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isShowtimeDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Showtime Dropdown List */}
              {isShowtimeDropdownOpen && selectedMovie && (
                <div className="mt-2 w-full bg-white rounded-2xl border border-[#e4e2e2] shadow-xl p-5 flex flex-col gap-5 z-20 animate-in fade-in duration-150">
                  {/* Date Tabs */}
                  <div>
                    <p className="text-xs font-semibold text-[#5f5e5e] mb-2">Chọn ngày chiếu</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {['Hôm nay, 29/10/2024', 'Ngày mai, 30/10/2024', 'Thứ Năm, 31/10/2024'].map(
                        (dStr) => (
                          <button
                            key={dStr}
                            type="button"
                            onClick={() => setSelectedDate(dStr)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                              selectedDate === dStr
                                ? 'bg-[#d71920] text-white shadow-xs'
                                : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
                            }`}
                          >
                            {dStr.split(',')[0]} ({dStr.split(' ')[1]})
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Showtime Pills */}
                  <div>
                    <p className="text-xs font-semibold text-[#5f5e5e] mb-2">Chọn khung giờ chiếu</p>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {SHOWTIME_TIMES.map((timeStr) => (
                        <button
                          key={timeStr}
                          type="button"
                          onClick={() => handleSelectTime(timeStr)}
                          className={`py-2.5 px-3 rounded-xl border text-sm font-bold text-center transition-all ${
                            selectedTime === timeStr
                              ? 'border-[#d71920] bg-[#d71920] text-white shadow-xs'
                              : 'border-[#e4e2e2] bg-white hover:border-[#d71920] hover:text-[#d71920] text-[#1b1c1c]'
                          }`}
                        >
                          {timeStr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING SUMMARY SIDEBAR (4 COLS) */}
          <aside className="lg:col-span-4 sticky top-24 flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-md overflow-hidden relative border border-[#e4e2e2]">
              <div className="h-1.5 w-full bg-[#d71920]" />
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-[#1b1c1c] uppercase tracking-wide">
                    Thông tin đặt vé
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#f5f3f3] text-[11px] font-semibold text-[#5f5e5e]">
                    Bước 1/3
                  </span>
                </div>

                {!selectedMovie || !selectedTime ? (
                  /* Empty State */
                  <div className="py-10 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#5f5e5e]">
                      <Film className="w-8 h-8" />
                    </div>
                    <p className="font-bold text-sm text-[#1b1c1c]">
                      Vui lòng chọn phim và suất chiếu
                    </p>
                    <p className="text-xs text-[#5f5e5e] max-w-[220px]">
                      Chọn phim từ danh sách bên trái để tiếp tục bước chọn ghế
                    </p>
                  </div>
                ) : (
                  /* Selected State */
                  <div className="flex flex-col gap-5">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f5f3f3]">
                      <img
                        src={selectedMovie.posterUrl}
                        alt={selectedMovie.title}
                        className="w-14 h-20 rounded object-cover shrink-0 shadow-xs"
                      />
                      <div className="flex flex-col min-w-0">
                        <h3 className="font-bold text-sm text-[#1b1c1c] line-clamp-2">
                          {selectedMovie.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="px-1.5 py-0.5 rounded bg-[#d71920] text-white text-[10px] font-bold">
                            2D
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-[#00588f] text-white text-[10px] font-semibold">
                            NexCinema
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 text-xs text-[#5f5e5e]">
                      <div className="flex items-start gap-2">
                        <Store className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#1b1c1c]">NexCinema Complex Lê Duẩn</p>
                          <p className="text-[11px]">Phòng chiếu tiêu chuẩn - Tầng 4</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold text-[#1b1c1c]">Suất chiếu: {selectedTime}</p>
                          <p className="text-[11px]">{selectedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pt-1">
                        <Ticket className="w-4 h-4 text-[#5f5e5e] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[#5f5e5e]">
                            Ghế: <span className="font-normal italic">Chưa chọn ghế</span>
                          </p>
                          <p className="text-[11px]">Vui lòng chọn vị trí ở bước tiếp theo</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full h-px bg-[#e4e2e2]" />

                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-[#5f5e5e]">Tạm tính:</span>
                        <span className="text-xl font-bold text-[#1b1c1c]">0 đ</span>
                      </div>
                      <p className="text-[11px] text-[#5f5e5e] text-right">
                        Giá hiển thị tạm tính trước khi chọn vị trí ghế
                      </p>
                    </div>
                  </div>
                )}

                {/* Submit CTA */}
                <button
                  onClick={handleProceedToSeatSelection}
                  disabled={!selectedMovie || !selectedTime}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    selectedMovie && selectedTime
                      ? 'bg-[#d71920] hover:bg-[#ae0011] text-white shadow-md active:scale-[0.98] cursor-pointer'
                      : 'bg-[#e4e2e2] text-[#5f5e5e] cursor-not-allowed'
                  }`}
                >
                  <span>Tiếp tục chọn ghế</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Realtime hold guarantee banner */}
            <div className="bg-[#f5f3f3] rounded-xl p-4 flex items-center gap-3 border border-[#e4e2e2]">
              <ShieldCheck className="w-6 h-6 text-[#d71920] shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-[#1b1c1c]">Giữ ghế theo thời gian thực</p>
                <p className="text-[#5f5e5e]">Hệ thống bảo lưu ghế 10 phút sau khi chọn</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
