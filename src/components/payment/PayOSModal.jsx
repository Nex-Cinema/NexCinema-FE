import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { QRCodeSVG } from 'qrcode.react';
import { AlertCircle, Check, Clock3, Copy, ExternalLink, Loader2, ShieldCheck, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { getPayOSPaymentStatus } from '../../api/paymentApi';
import { formatVND } from '../../utils/formatHelper';

const isPaymentSuccess = (status) => ['PAID', 'THANH_CONG', 'SUCCESS', 'DA_THANH_TOAN'].includes(status);
const isPaymentFailed = (status) => ['FAILED', 'CANCELLED', 'THAT_BAI', 'DA_HUY'].includes(status);
const isImageUrl = (value) => typeof value === 'string' && /^(https?:\/\/|data:image\/)/.test(value);
const isBase64Image = (value) => typeof value === 'string' && value.length > 100 && /^[A-Za-z0-9+/]+={0,2}$/.test(value);

const getInitialSeconds = (expiresAt) => {
  if (!expiresAt) return 600;
  const target = typeof expiresAt === 'number' ? expiresAt : new Date(expiresAt).getTime();
  return Math.max(0, Math.floor((target - Date.now()) / 1000));
};

const PayOSModal = ({
  isOpen,
  onClose,
  maGiaoDich,
  qrCode,
  checkoutUrl,
  orderCode,
  amount,
  expiresAt,
  onSuccess,
  onCancel,
  onTimeout,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => getInitialSeconds(expiresAt));
  const [modalState, setModalState] = useState(() => (qrCode || checkoutUrl ? 'pending' : 'loading'));
  const mountedRef = useRef(true);
  const timeoutHandledRef = useRef(false);

  useEffect(() => () => { mountedRef.current = false; }, []);

  const handleTimeout = useCallback(() => {
    if (timeoutHandledRef.current) return;
    timeoutHandledRef.current = true;
    setModalState('failed');
    toast.error('Giao dịch thanh toán đã hết hạn.');
    window.setTimeout(() => onTimeout?.(), 1200);
  }, [onTimeout]);

  useEffect(() => {
    if (!isOpen || modalState !== 'pending') return undefined;
    const timer = window.setInterval(() => {
      setTimeLeft((current) => {
        const next = expiresAt ? getInitialSeconds(expiresAt) : Math.max(0, current - 1);
        if (next === 0) handleTimeout();
        return next;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, handleTimeout, isOpen, modalState]);

  useEffect(() => {
    if (!isOpen || !maGiaoDich || modalState !== 'pending') return undefined;
    let pollTimer;

    const checkStatus = async () => {
      try {
        const response = await getPayOSPaymentStatus(maGiaoDich);
        if (!mountedRef.current) return;
        const status = response?.trangThaiGiaoDich || response?.status || response?.data?.trangThaiGiaoDich || response?.data?.status;

        if (isPaymentSuccess(status)) {
          window.clearInterval(pollTimer);
          setModalState('success');
          toast.success('Thanh toán thành công!');
          window.setTimeout(() => mountedRef.current && onSuccess?.(response), 1000);
        } else if (isPaymentFailed(status)) {
          window.clearInterval(pollTimer);
          setModalState('failed');
          toast.error('Giao dịch đã bị hủy hoặc thất bại.');
        }
      } catch {
        // A transient network error is retried on the next polling interval.
      }
    };

    checkStatus();
    pollTimer = window.setInterval(checkStatus, 3000);
    return () => window.clearInterval(pollTimer);
  }, [isOpen, maGiaoDich, modalState, onSuccess]);

  if (!isOpen) return null;

  const closeModal = () => (onClose || onCancel)?.();
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const copyOrderCode = async () => {
    if (!orderCode) return;
    await navigator.clipboard.writeText(String(orderCode));
    setCopied(true);
    toast.success('Đã sao chép mã đơn hàng.');
    window.setTimeout(() => mountedRef.current && setCopied(false), 1800);
  };

  const renderQr = () => {
    if (isImageUrl(qrCode)) return <img src={qrCode} alt="Mã QR PayOS" className="size-full object-contain" />;
    if (isBase64Image(qrCode)) return <img src={`data:image/png;base64,${qrCode}`} alt="Mã QR PayOS" className="size-full object-contain" />;
    const qrValue = typeof qrCode === 'string' && qrCode ? qrCode : checkoutUrl;
    if (qrValue) return <QRCodeSVG value={qrValue} size={240} className="size-full" bgColor="#ffffff" fgColor="#171717" level="M" />;
    return <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-red-600"><AlertCircle size={28} /><span className="text-xs font-bold">Không nhận được dữ liệu QR.</span></div>;
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] grid place-items-center overflow-y-auto bg-neutral-950/70 p-4 backdrop-blur-sm">
      <button type="button" aria-label="Đóng thanh toán" className="absolute inset-0 cursor-default" onClick={modalState === 'pending' || modalState === 'failed' ? closeModal : undefined} />

      <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[30px] bg-[#f7f5f4] text-left shadow-[0_40px_100px_rgba(0,0,0,.38)] ring-1 ring-white/10">
        <header className="flex items-start justify-between gap-4 bg-neutral-950 px-6 py-5 text-white sm:px-8">
          <div><span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-blue-400"><ShieldCheck size={14} /> PayOS</span><h2 className="mt-2 text-2xl font-extrabold tracking-[-.03em]">Thanh toán bằng mã QR</h2></div>
          {(modalState === 'pending' || modalState === 'failed') && <button type="button" onClick={closeModal} className="grid size-9 place-items-center rounded-xl bg-white/10 text-neutral-300 transition hover:bg-white/15 hover:text-white"><X size={18} /></button>}
        </header>

        {modalState === 'loading' && (
          <div className="grid min-h-80 place-items-center p-8 text-center"><div><Loader2 className="mx-auto animate-spin text-blue-600" size={34} /><strong className="mt-4 block text-lg text-neutral-950">Đang tạo giao dịch</strong><p className="mt-1 text-xs text-neutral-500">Thông tin QR sẽ xuất hiện trong giây lát.</p></div></div>
        )}

        {modalState === 'success' && (
          <div className="grid min-h-80 place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Check size={30} strokeWidth={3} /></span><strong className="mt-5 block text-xl text-neutral-950">Đã nhận thanh toán</strong><p className="mt-2 text-sm text-neutral-500">NexCinema đang phát hành vé điện tử của bạn.</p><Loader2 className="mx-auto mt-5 animate-spin text-neutral-400" size={18} /></div></div>
        )}

        {modalState === 'failed' && (
          <div className="grid min-h-80 place-items-center p-8 text-center"><div><span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-100 text-red-700"><AlertCircle size={30} /></span><strong className="mt-5 block text-xl text-neutral-950">Giao dịch chưa hoàn tất</strong><p className="mt-2 text-sm text-neutral-500">Phiên thanh toán đã hết hạn hoặc bị hủy.</p><button type="button" onClick={closeModal} className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-xs font-bold text-white">Quay lại thanh toán</button></div></div>
        )}

        {modalState === 'pending' && (
          <div className="grid gap-6 p-5 sm:grid-cols-[260px_1fr] sm:p-7">
            <div>
              <div className="aspect-square rounded-3xl bg-white p-4 shadow-[0_15px_40px_rgba(23,23,23,.08)] ring-1 ring-black/5">{renderQr()}</div>
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-black/5"><span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-neutral-500"><Clock3 size={14} className="text-red-500" /> Còn lại</span><strong className="font-mono text-base text-neutral-950">{minutes}:{seconds}</strong></div>
            </div>

            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-neutral-400">Tổng thanh toán</p>
              <strong className="mt-1 text-3xl font-black tracking-tight text-neutral-950">{formatVND(amount)}</strong>

              <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-black/5">
                <small className="text-[9px] font-bold uppercase tracking-wider text-neutral-400">Mã đơn hàng</small>
                <div className="mt-1 flex items-center justify-between gap-3"><span className="truncate font-mono text-sm font-bold text-neutral-950">{orderCode || 'Đang cập nhật'}</span><button type="button" onClick={copyOrderCode} className="grid size-8 shrink-0 place-items-center rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200">{copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}</button></div>
              </div>

              <ol className="mt-5 space-y-3 text-xs leading-relaxed text-neutral-600">
                <li><strong className="mr-2 text-neutral-950">01</strong>Mở ứng dụng ngân hàng hỗ trợ VietQR.</li>
                <li><strong className="mr-2 text-neutral-950">02</strong>Quét mã và kiểm tra đúng số tiền.</li>
                <li><strong className="mr-2 text-neutral-950">03</strong>Giữ trang này mở; vé sẽ tự xác nhận.</li>
              </ol>

              <div className="mt-auto pt-6">
                <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between rounded-xl bg-blue-600 pl-4 pr-2 text-xs font-extrabold text-white transition hover:bg-blue-700">Mở trang PayOS <span className="grid size-8 place-items-center rounded-lg bg-white/15"><ExternalLink size={14} /></span></a>
                <p className="mt-3 flex items-center justify-center gap-2 text-[10px] font-medium text-neutral-400"><Loader2 size={12} className="animate-spin" /> Đang tự động kiểm tra giao dịch</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>,
    document.body,
  );
};

export default PayOSModal;
