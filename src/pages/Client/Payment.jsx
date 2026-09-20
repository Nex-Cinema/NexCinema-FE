import { useState } from 'react';
import { ChevronLeft, ShieldCheck, Clock } from 'lucide-react';
import { formatVND } from '../../utils/formatHelper';
import toast from 'react-hot-toast';
import { simulatedCheckout, realCheckout } from '../../api/bookingApi';
import { getBookingDetail } from '../../api/bookingHistoryApi';
import { createPayOSPayment, createVNPayPayment } from '../../api/paymentApi';
import PayOSModal from '../../components/payment/PayOSModal';

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
  heldSeatIds
}) => {
  const [paymentMethod, setPaymentMethod] = useState('PAYOS'); // Default to PayOS
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayOSModal, setShowPayOSModal] = useState(false);
  const [payOSData, setPayOSData] = useState(null);

  const formatTimeSeconds = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  };

  const handleConfirmPayment = async () => {
    if (!maSuatChieu) {
      toast.error("Không tìm thấy thông tin suất chiếu!");
      return;
    }
    if (!heldSeatIds || heldSeatIds.length === 0) {
      toast.error("Không tìm thấy danh sách ghế đang giữ!");
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'PAYOS') {
      const toastId = toast.loading("Đang khởi tạo giao dịch thanh toán PayOS...");
      try {
        // 1. Create booking in CHO_THANH_TOAN status
        const checkoutRes = await realCheckout({
          MaSuatChieu: maSuatChieu,
          DanhSachMaGheSuatChieu: heldSeatIds,
          PhuongThucThanhToan: 'PAYOS'
        });

        // 2. Create PayOS payment link
        const payosPaymentRes = await createPayOSPayment(checkoutRes.MaPhieuDat);
        toast.dismiss(toastId);

        // 3. Open QR modal with link details
        setPayOSData(payosPaymentRes);
        setShowPayOSModal(true);
      } catch (err) {
        console.error("PayOS checkout error:", err);
        const errMsg = err.response?.data?.message || err.message || "Không thể tạo link thanh toán PayOS. Vui lòng thử lại.";
        toast.error(errMsg);
        toast.dismiss(toastId);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (paymentMethod === 'VNPAY') {
      const toastId = toast.loading("Đang khởi tạo giao dịch thanh toán VNPay...");
      try {
        // 1. Create booking in CHO_THANH_TOAN status
        const checkoutRes = await realCheckout({
          MaSuatChieu: maSuatChieu,
          DanhSachMaGheSuatChieu: heldSeatIds,
          PhuongThucThanhToan: 'VNPAY'
        });

        // 2. Create VNPay payment URL
        const vnpayPaymentRes = await createVNPayPayment(checkoutRes.MaPhieuDat);
        toast.dismiss(toastId);

        // 3. Redirect to VNPay payment URL
        if (vnpayPaymentRes && vnpayPaymentRes.paymentUrl) {
          window.location.href = vnpayPaymentRes.paymentUrl;
        } else {
          throw new Error("Không nhận được URL thanh toán từ cổng VNPay.");
        }
      } catch (err) {
        console.error("VNPay checkout error:", err);
        const errMsg = err.response?.data?.message || err.message || "Không thể tạo link thanh toán VNPay. Vui lòng thử lại.";
        toast.error(errMsg);
        toast.dismiss(toastId);
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Simulated Checkout for fallback methods (e.g. cash or others)
    const toastId = toast.loading("Đang xử lý thanh toán giả lập...");
    try {
      const PhuongThucThanhToan = paymentMethod === 'VNPAY' ? 'VNPAY' : 'VNPAY';

      const checkoutPayload = {
        MaSuatChieu: maSuatChieu,
        DanhSachMaGheSuatChieu: heldSeatIds,
        PhuongThucThanhToan,
        KetQuaThanhToan: 'THANH_CONG',
      };

      const checkoutRes = await simulatedCheckout(checkoutPayload);
      toast.success("Thanh toán giả lập thành công!");

      // Attempt to load full ticket details with MaChiTietDat
      try {
        const detailData = await getBookingDetail(checkoutRes.MaPhieuDat);
        toast.dismiss(toastId);
        onPaymentSuccess(detailData, checkoutRes);
      } catch (detailErr) {
        console.error("Lỗi khi tải chi tiết vé vừa đặt:", detailErr);
        toast.error("Không thể tải chi tiết mã vé từ máy chủ. Đang chuyển sang màn hình xác nhận fallback...");
        toast.dismiss(toastId);
        onPaymentSuccess(null, checkoutRes);
      }
    } catch (err) {
      console.error("Simulated checkout error:", err);
      const errMsg = err.response?.data?.message || err.message || "Thanh toán giả lập thất bại. Vui lòng thử lại.";
      toast.error(errMsg);
      toast.dismiss(toastId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOSSuccess = async (statusRes) => {
    setShowPayOSModal(false);
    setIsSubmitting(true);
    const toastId = toast.loading("Đang tải chi tiết vé đặt thành công...");
    try {
      const targetPhieuDat = statusRes.maPhieuDat || payOSData?.maPhieuDat;
      const detailData = await getBookingDetail(targetPhieuDat);
      toast.dismiss(toastId);
      onPaymentSuccess(detailData, { MaPhieuDat: targetPhieuDat });
    } catch (err) {
      console.error("Lỗi khi tải chi tiết vé đặt sau PayOS:", err);
      toast.error("Không thể tải chi tiết mã vé từ máy chủ. Đang chuyển sang màn hình xác nhận fallback...");
      toast.dismiss(toastId);
      onPaymentSuccess(null, { MaPhieuDat: statusRes.maPhieuDat || payOSData?.maPhieuDat });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayOSCancel = () => {
    setShowPayOSModal(false);
  };

  const handlePayOSTimeout = () => {
    setShowPayOSModal(false);
    toast.error("Giao dịch thanh toán PayOS đã hết hạn giữ ghế.");
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl animate-in flex-col gap-8 text-left fade-in duration-500">
      
      {/* Tiêu đề trang & Thời gian giữ ghế */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <button 
            onClick={onBack}
            className="flex w-fit cursor-pointer items-center gap-1 text-sm font-semibold text-neutral-500 transition-colors hover:text-neutral-950"
          >
            <ChevronLeft size={16}/> Quay lại chọn ghế
          </button>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-neutral-950">Thanh toán</h1>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-mono text-sm font-bold text-(--client-primary)">
          ⏱ Thời gian giữ ghế: {formatTimeSeconds(timeLeft)}
        </div>
      </div>

      {timeLeft !== undefined && timeLeft !== null && (
        <div className="flex max-w-md items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-bold text-amber-700">
          <Clock size={16} />
          <span className="text-xs uppercase tracking-wider flex-1">Thời gian thanh toán còn lại:</span>
          <span className="text-base font-mono font-black tracking-widest">{formatTimeSeconds(timeLeft)}</span>
        </div>
      )}

      {/* Bố cục Grid 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_4fr] gap-8 items-start">
        
        {/* CỘT TRÁI: PHƯƠNG THỨC THANH TOÁN */}
        <div className="flex flex-col gap-4 w-full">
          
          {/* Phương thức 1: PayOS */}
          <label 
            onClick={() => setPaymentMethod('PAYOS')}
            className={`flex items-center gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === 'PAYOS' 
                ? 'border-(--client-primary) bg-red-50 shadow-sm' 
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'PAYOS'} 
              onChange={() => {}} 
              className="accent-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-[10px] font-black tracking-tighter select-none">
              OS
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-neutral-950 md:text-base">PayOS</span>
              <span className="text-xs font-medium text-neutral-500">Quét mã QR / chuyển khoản ngân hàng qua PayOS</span>
            </div>
          </label>

          {/* Phương thức 2: VNPAY */}
          <label 
            onClick={() => setPaymentMethod('VNPAY')}
            className={`flex items-center gap-4 p-5 rounded-xl border transition-all cursor-pointer ${
              paymentMethod === 'VNPAY' 
                ? 'border-(--client-primary) bg-red-50 shadow-sm' 
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50'
            }`}
          >
            <input 
              type="radio" 
              name="payment" 
              checked={paymentMethod === 'VNPAY'} 
              onChange={() => {}} 
              className="accent-blue-500 w-4 h-4 cursor-pointer"
            />
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-[10px] font-black tracking-tighter select-none">
              VN
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm font-bold text-neutral-950 md:text-base">VNPay</span>
              <span className="text-xs font-medium text-neutral-500">Thanh toán qua cổng thanh toán VNPay</span>
            </div>
          </label>

          {/* NÚT THANH TOÁN CHỦ ĐẠO */}
          <button 
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className={`client-primary-button mt-4 w-full py-4 text-center text-base ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác Nhận Thanh Toán'}
          </button>
        </div>

        {/* CỘT PHẢI: BẢNG TÓM TẮT THÔNG TIN VÉ PHIM */}
        <aside className="flex w-full flex-col gap-4 rounded-2xl border border-neutral-200 border-t-4 border-t-(--client-primary) bg-white p-6 text-neutral-950 shadow-lg">
          <div>
            <h3 className="truncate text-xl font-extrabold tracking-tight text-neutral-950">{movie.title}</h3>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-neutral-500">
              Phim dành cho khán giả từ dưới 13 tuổi với điều kiện xem cùng cha, mẹ hoặc người giám hộ
            </p>
          </div>

          <div className="my-1 h-px w-full bg-neutral-200"></div>

          {/* Chi tiết nội dung */}
          <div className="flex flex-col gap-3 text-xs font-medium text-neutral-600">
            <div className="grid grid-cols-2 gap-4">
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Thời gian suất chiếu</span>
                <span className="text-sm font-bold text-neutral-950">
                  {formatTime(currentSlot?.GioChieu || currentSlot?.time)} - {selectedDateId}
                </span>
              </p>
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Phòng chiếu & số vé</span>
                <span className="text-sm font-bold text-neutral-950">Phòng {currentSlot?.TenPhong || '02'} • {selectedSeats.length} vé</span>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-1">
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Loại vé</span>
                <span className="text-sm font-bold text-neutral-950">Người lớn (2D)</span>
              </p>
              <p className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Vị trí số ghế</span>
                <span className="text-base font-black tracking-wide text-(--client-primary)">
                  {selectedSeats.map(s => typeof s === 'object' ? s.TenGhe : s).join(', ')}
                </span>
              </p>
            </div>
          </div>

          <div className="my-1 h-px w-full bg-neutral-200"></div>

          {/* Tổng tiền chân trang */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Số tiền cần thanh toán</span>
            <span className="text-2xl font-black text-(--client-primary)">
              {formatVND(amount)}
            </span>
          </div>
          
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10px] font-medium text-neutral-400">
            <ShieldCheck size={12} />
            <span>Giao dịch bảo mật an toàn mã hóa SSL</span>
          </div>
        </aside>

      </div>

      {/* PayOS QR Modal */}
      {payOSData && (
        <PayOSModal
          isOpen={showPayOSModal}
          onClose={handlePayOSCancel}
          maGiaoDich={payOSData.maGiaoDich}
          qrCode={payOSData.qrCode}
          checkoutUrl={payOSData.checkoutUrl}
          orderCode={payOSData.orderCode}
          amount={payOSData.amount}
          expiresAt={payOSData.expiresAt}
          onSuccess={handlePayOSSuccess}
          onCancel={handlePayOSCancel}
          onTimeout={handlePayOSTimeout}
        />
      )}
    </div>
  );
};

export default Payment;


