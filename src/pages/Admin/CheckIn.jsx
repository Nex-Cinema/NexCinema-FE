import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import {
  Camera,
  CameraOff,
  Upload,
  Keyboard,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  QrCode,
  Ticket,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';

import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminButton from '../../components/Admin/Common/AdminButton';
import { normalizeAdmissionQr } from '../../utils/admissionQr';
import { checkInAdmissionQr } from '../../services/admin/admissionService';
import { formatDateTime } from '../../utils/formatHelper';

const READER_ELEMENT_ID = 'admin-qr-reader';

const CheckIn = () => {
  // Input methods & states
  const [manualInput, setManualInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scanner status: 'idle' | 'starting' | 'scanning' | 'permission_error' | 'stopped'
  const [cameraStatus, setCameraStatus] = useState('idle');
  const [cameraError, setCameraError] = useState('');

  // Result state
  const [checkInResult, setCheckInResult] = useState(null); // { MaPhieuDat, DaCheckIn, ThoiGianCheckIn, SoLuongGhe }
  const [apiError, setApiError] = useState('');

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const isProcessingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Safely stop camera scanner with option to skip setState (e.g. unmount cleanup)
  const stopCamera = useCallback(async ({ updateState = true } = {}) => {
    if (html5QrCodeRef.current) {
      try {
        if (html5QrCodeRef.current.isScanning) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch {
        // Ignored to avoid browser console noise
      }
      html5QrCodeRef.current = null;
    }
    if (updateState && isMountedRef.current) {
      setCameraStatus('idle');
    }
  }, []);

  // Track mounted state and clean up on component unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      stopCamera({ updateState: false });
    };
  }, [stopCamera]);

  // Execute admission check-in with normalized payload
  const executeCheckIn = useCallback(
    async (rawCode) => {
      if (isProcessingRef.current) return;

      // 1. Validation & normalization
      let normalized;
      try {
        normalized = normalizeAdmissionQr(rawCode);
        if (isMountedRef.current) {
          setValidationError('');
        }
      } catch (err) {
        if (isMountedRef.current) {
          setValidationError(err.message || 'Mã QR không hợp lệ.');
          setIsSubmitting(false);
        }
        return;
      }

      // Stop scanner immediately on decode to prevent duplicate submission
      isProcessingRef.current = true;
      if (isMountedRef.current) {
        setIsSubmitting(true);
        setApiError('');
        setCheckInResult(null);
      }

      // Stop camera if running
      await stopCamera({ updateState: true });

      try {
        const result = await checkInAdmissionQr(normalized);
        if (isMountedRef.current) {
          setCheckInResult(result);
        }
        toast.success(`Soát vé thành công cho phiếu đặt ${result.MaPhieuDat}!`);
      } catch (err) {
        const errorMsg =
          err.response?.data?.message ||
          err.message ||
          'Soát vé thất bại. Vui lòng kiểm tra lại vé.';
        if (isMountedRef.current) {
          setApiError(errorMsg);
        }
        toast.error(errorMsg);
      } finally {
        if (isMountedRef.current) {
          setIsSubmitting(false);
        }
        isProcessingRef.current = false;
      }
    },
    [stopCamera]
  );

  // Start camera scanner
  const startCamera = async () => {
    // Check for secure context or localhost before attempting camera access
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setCameraStatus('permission_error');
      setCameraError(
        'Tính năng quét Camera yêu cầu kết nối bảo mật HTTPS hoặc môi trường localhost. Vui lòng sử dụng kết nối an toàn hoặc dùng tính năng tải ảnh QR / nhập mã vé thủ công.'
      );
      return;
    }

    await stopCamera({ updateState: true });
    setCameraStatus('starting');
    setCameraError('');
    setApiError('');
    setValidationError('');

    try {
      const scanner = new Html5Qrcode(READER_ELEMENT_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      const qrCodeSuccessCallback = async (decodedText) => {
        // Prevent duplicate frame decodes
        if (isProcessingRef.current) return;
        await executeCheckIn(decodedText);
      };

      const qrCodeErrorCallback = () => {
        // Continuous frame scanning errors - ignored as expected when no QR is in frame
      };

      await scanner.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      if (isMountedRef.current) {
        setCameraStatus('scanning');
      }
    } catch {
      if (isMountedRef.current) {
        setCameraStatus('permission_error');
        setCameraError(
          'Không thể mở camera. Vui lòng cấp quyền truy cập thiết bị hoặc sử dụng tính năng tải ảnh QR / nhập mã vé.'
        );
      }
      if (html5QrCodeRef.current) {
        try {
          await html5QrCodeRef.current.clear();
        } catch {
          // Ignored
        }
        html5QrCodeRef.current = null;
      }
    }
  };

  // Manual submit handler
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualInput.trim()) {
      setValidationError('Vui lòng nhập hoặc quét mã QR soát vé.');
      return;
    }
    await executeCheckIn(manualInput);
  };

  // File upload fallback handler
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError('');
    setApiError('');
    setIsSubmitting(true);

    let fileScanner = null;
    try {
      await stopCamera({ updateState: true });
      fileScanner = new Html5Qrcode(READER_ELEMENT_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });

      const decodedText = await fileScanner.scanFile(file, true);
      await executeCheckIn(decodedText);
    } catch (err) {
      // If error came from executeCheckIn normalization or scanning failed
      if (isMountedRef.current) {
        setValidationError(
          err?.message ||
            'Không tìm thấy mã QR hợp lệ trong hình ảnh đã chọn. Vui lòng thử lại với ảnh rõ hơn.'
        );
        setIsSubmitting(false);
      }
    } finally {
      if (fileScanner) {
        try {
          await fileScanner.clear();
        } catch {
          // Ignored
        }
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleReset = () => {
    setCheckInResult(null);
    setApiError('');
    setValidationError('');
    setManualInput('');
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Soát vé (Check-in)"
        subtitle="Quét mã QR hoặc nhập mã vé để xác nhận khách hàng vào rạp."
      />

      <div className="mx-auto max-w-5xl space-y-6">
        {/* Results Banner if Success or API Error */}
        {checkInResult && (
          <div
            className="flex flex-col gap-4 rounded-xl border border-emerald-300 bg-emerald-50/80 p-5 sm:flex-row sm:items-start sm:justify-between"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3.5">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-emerald-950">
                  Soát vé thành công!
                </h2>
                <div className="mt-2 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 sm:gap-6 text-neutral-700">
                  <div className="flex items-center gap-1.5">
                    <Ticket className="size-4 text-emerald-600" />
                    <span>Mã đặt vé: <strong className="font-mono text-neutral-900">{checkInResult.MaPhieuDat}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="size-4 text-emerald-600" />
                    <span>Số lượng ghế: <strong className="text-neutral-900">{checkInResult.SoLuongGhe} ghế</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-emerald-600" />
                    <span>Thời gian: <strong className="text-neutral-900">{checkInResult.ThoiGianCheckIn ? formatDateTime(checkInResult.ThoiGianCheckIn) : 'Vừa xong'}</strong></span>
                  </div>
                </div>
              </div>
            </div>
            <AdminButton variant="outline" className="shrink-0 self-end sm:self-center" onClick={handleReset}>
              <RefreshCw className="size-4" /> Tiếp tục soát vé
            </AdminButton>
          </div>
        )}

        {apiError && (
          <div
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
            <div className="flex-1">
              <strong className="font-semibold">Soát vé không thành công:</strong>
              <p className="mt-0.5">{apiError}</p>
            </div>
            <button
              type="button"
              onClick={() => setApiError('')}
              className="text-xs font-semibold text-red-700 underline hover:no-underline"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* CAMERA SCANNER SECTION (7 cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-[var(--admin-border)] pb-4">
              <div className="flex items-center gap-2">
                <Camera className="size-5 text-[var(--admin-brand)]" />
                <h2 className="text-base font-bold text-[var(--admin-text)]">
                  Quét trực tiếp qua Camera
                </h2>
              </div>
              {cameraStatus === 'scanning' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  Đang quét
                </span>
              )}
            </div>

            {/* Camera Viewport / Container */}
            <div className="mt-4 flex flex-col items-center justify-center">
              <div
                id={READER_ELEMENT_ID}
                className="w-full max-w-[420px] overflow-hidden rounded-xl bg-neutral-100 min-h-[300px] flex items-center justify-center"
              >
                {cameraStatus === 'idle' && (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                    <QrCode className="size-16 text-neutral-300 mb-2 stroke-[1.2]" />
                    <p className="text-sm font-medium text-neutral-700">
                      Camera đang tạm dừng
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      Nhấn nút bên dưới để bật camera trên thiết bị
                    </p>
                  </div>
                )}

                {cameraStatus === 'starting' && (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <RefreshCw className="size-8 text-[var(--admin-brand)] animate-spin mb-3" />
                    <p className="text-sm font-medium text-neutral-700">
                      Đang khởi tạo camera...
                    </p>
                  </div>
                )}

                {cameraStatus === 'permission_error' && (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-red-600">
                    <CameraOff className="size-12 mb-2 text-red-400" />
                    <p className="text-xs font-medium text-red-700 leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                )}
              </div>

              {/* Camera Action Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {cameraStatus !== 'scanning' ? (
                  <AdminButton
                    type="button"
                    variant="primary"
                    disabled={isSubmitting || cameraStatus === 'starting'}
                    onClick={startCamera}
                  >
                    <Camera className="size-4" /> Bật Camera quét QR
                  </AdminButton>
                ) : (
                  <AdminButton
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={() => stopCamera({ updateState: true })}
                  >
                    <CameraOff className="size-4" /> Tắt Camera
                  </AdminButton>
                )}

                {/* QR Image Upload Fallback */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="qr-file-input"
                />
                <AdminButton
                  type="button"
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="size-4" /> Tải ảnh mã QR
                </AdminButton>
              </div>
            </div>
          </div>

          {/* MANUAL INPUT SECTION (5 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-[var(--admin-border)] pb-4">
              <Keyboard className="size-5 text-[var(--admin-brand)]" />
              <h2 className="text-base font-bold text-[var(--admin-text)]">
                Nhập hoặc dán mã thủ công
              </h2>
            </div>

            <form onSubmit={handleManualSubmit} className="mt-4 flex flex-1 flex-col justify-between space-y-4">
              <div className="space-y-3">
                <label htmlFor="manual-qr-input" className="block text-xs font-semibold text-neutral-700">
                  Mã QR hoặc UUID vé:
                </label>
                <div className="relative">
                  <textarea
                    id="manual-qr-input"
                    rows={4}
                    value={manualInput}
                    onChange={(e) => {
                      setManualInput(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="Dán mã QR (ví dụ: QR_123e4567-e89b-12d3-a456-426614174000) hoặc link vé vào đây..."
                    disabled={isSubmitting}
                    className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-soft)] p-3 text-sm font-mono text-neutral-900 placeholder:font-sans placeholder:text-neutral-400 focus:border-[var(--admin-brand)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--admin-brand)]/20"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleManualSubmit(e);
                      }
                    }}
                  />
                </div>

                {validationError && (
                  <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5" role="alert">
                    <AlertCircle className="size-3.5 shrink-0" />
                    {validationError}
                  </p>
                )}

                <div className="rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500 space-y-1 border border-neutral-200">
                  <p className="font-semibold text-neutral-700">Định dạng được chấp nhận:</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Mã chuẩn: <code className="font-mono text-neutral-800">QR_&lt;UUID&gt;</code></li>
                    <li>Chuỗi UUID không tiền tố: <code className="font-mono text-neutral-800">&lt;UUID&gt;</code></li>
                    <li>Đường link hoặc tin nhắn chứa mã vé QR duy nhất.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2">
                <AdminButton
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting || !manualInput.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="size-4 animate-spin" /> Đang kiểm tra vé...
                    </>
                  ) : (
                    <>
                      Xác nhận soát vé <ArrowRight className="size-4" />
                    </>
                  )}
                </AdminButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CheckIn;
