import { useEffect, useMemo, useState } from 'react';
import { Banknote, Clock3, QrCode, RefreshCw, TicketCheck, UserRound } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { AdminErrorState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import { CinemaSeat, SeatLegend } from '../../components/Seats/SeatVisuals';
import showtimeService from '../../services/admin/showtimeService';
import { createCounterSale, getCounterPayosStatus } from '../../services/admin/counterSaleService';
import { formatVND } from '../../utils/formatHelper';
import { formatShowtimeTime } from '../../utils/showtimeHelper';
import { getErrorMessage, showError, showSuccess } from '../../utils/toastHelper';
import { getPaymentGateways } from '../../api/paymentApi';

const paymentMethods = [
  { id: 'TIEN_MAT', label: 'Tiền mặt', description: 'Xác nhận sau khi đã nhận đủ tiền', icon: Banknote },
  { id: 'PAYOS', label: 'Chuyển khoản QR', description: 'Khách quét mã PayOS ngay tại quầy', icon: QrCode },
];

const isFutureShowtime = (showtime) => {
  if (!showtime.NgayChieu || !showtime.GioChieu) return false;
  const start = new Date(`${showtime.NgayChieu}T${showtime.GioChieu}`);
  return !Number.isNaN(start.getTime()) && start > new Date();
};

const CounterSales = () => {
  const [showtimes, setShowtimes] = useState([]);
  const [selectedShowtimeId, setSelectedShowtimeId] = useState('');
  const [seats, setSeats] = useState([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('TIEN_MAT');
  const [guest, setGuest] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [seatLoading, setSeatLoading] = useState(false);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [payosAvailable, setPayosAvailable] = useState(false);

  const loadSeats = async (showtimeId) => {
    if (!showtimeId) return;
    setSeatLoading(true);
    try {
      setSeats(await showtimeService.getShowtimeSeats(showtimeId));
    } catch (requestError) {
      showError(getErrorMessage(requestError, 'Không thể tải sơ đồ ghế'));
      setSeats([]);
    } finally {
      setSeatLoading(false);
    }
  };

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [showtimeItems, gateways] = await Promise.all([showtimeService.getShowtimes(), getPaymentGateways()]);
      const items = showtimeItems.filter((showtime) => showtime.KhaDung === 1 && isFutureShowtime(showtime));
      setPayosAvailable(gateways.some((gateway) => gateway.provider === 'PAYOS' && gateway.available));
      setShowtimes(items);
      const firstId = items[0]?.MaSuatChieu || '';
      setSelectedShowtimeId(firstId);
      setSelectedSeatIds([]);
      setResult(null);
      if (firstId) await loadSeats(firstId);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const loadInitialData = async () => {
      try {
        const [showtimeItems, gateways] = await Promise.all([showtimeService.getShowtimes(), getPaymentGateways()]);
        const items = showtimeItems.filter((showtime) => showtime.KhaDung === 1 && isFutureShowtime(showtime));
        if (!active) return;
        setShowtimes(items);
        setPayosAvailable(gateways.some((gateway) => gateway.provider === 'PAYOS' && gateway.available));
        const firstId = items[0]?.MaSuatChieu || '';
        setSelectedShowtimeId(firstId);
        if (firstId) {
          const seatItems = await showtimeService.getShowtimeSeats(firstId);
          if (active) setSeats(seatItems);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadInitialData();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const transactionId = result?.payment?.maGiaoDich;
    if (!transactionId || result?.TrangThai !== 'CHO_THANH_TOAN') return undefined;

    let active = true;
    let checking = false;
    const timer = window.setInterval(async () => {
      if (checking) return;
      checking = true;
      try {
        const status = await getCounterPayosStatus(transactionId);
        if (!active) return;
        if (status.trangThaiGiaoDich === 'THANH_CONG') {
          window.clearInterval(timer);
          setResult((current) => ({ ...current, TrangThai: 'DA_THANH_TOAN', QRPayload: `QR_${status.maPhieuDat}` }));
          showSuccess('Đã nhận chuyển khoản và phát hành vé');
          await loadSeats(selectedShowtimeId);
        } else if (status.trangThaiGiaoDich === 'THAT_BAI') {
          window.clearInterval(timer);
          setResult((current) => ({ ...current, TrangThai: 'DA_HUY' }));
          showError('Giao dịch chuyển khoản không thành công');
          await loadSeats(selectedShowtimeId);
        }
      } catch {
        // Keep polling; a transient gateway error must not discard the counter sale.
      } finally {
        checking = false;
      }
    }, 3000);

    return () => { active = false; window.clearInterval(timer); };
  }, [result?.payment?.maGiaoDich, result?.TrangThai, selectedShowtimeId]);

  const selectedShowtime = showtimes.find((item) => item.MaSuatChieu === selectedShowtimeId);
  const selectedSeats = useMemo(
    () => seats.filter((seat) => selectedSeatIds.includes(seat.MaGheSuatChieu)),
    [seats, selectedSeatIds],
  );
  const estimatedTotal = selectedSeats.reduce((total, seat) => total + Number(seat.GiaVe || 0), 0);

  const changeShowtime = async (event) => {
    const nextId = event.target.value;
    setSelectedShowtimeId(nextId);
    setSelectedSeatIds([]);
    setResult(null);
    await loadSeats(nextId);
  };

  const toggleSeat = (seat) => {
    if (seat.TrangThai !== 0 || seat.KhaDung !== 1 || submitting) return;
    setSelectedSeatIds((current) => current.includes(seat.MaGheSuatChieu)
      ? current.filter((id) => id !== seat.MaGheSuatChieu)
      : [...current, seat.MaGheSuatChieu]);
  };

  const submit = async () => {
    if (!selectedShowtimeId || selectedSeatIds.length === 0) {
      showError('Vui lòng chọn suất chiếu và ít nhất một ghế');
      return;
    }
    if (paymentMethod === 'PAYOS' && !payosAvailable) {
      showError('PayOS chưa được cấu hình trên máy chủ');
      return;
    }
    if (guest.phone && !/^0\d{9}$/.test(guest.phone)) {
      showError('Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0');
      return;
    }

    setSubmitting(true);
    try {
      const data = await createCounterSale({
        MaSuatChieu: selectedShowtimeId,
        DanhSachMaGheSuatChieu: selectedSeatIds,
        PhuongThucThanhToan: paymentMethod,
        ...(guest.name.trim() && { TenKhachHang: guest.name.trim() }),
        ...(guest.phone.trim() && { SoDienThoai: guest.phone.trim() }),
      });
      setResult(data);
      setSelectedSeatIds([]);
      if (data.TrangThai === 'DA_THANH_TOAN') {
        showSuccess('Bán vé tại quầy thành công');
        await loadSeats(selectedShowtimeId);
      }
    } catch (requestError) {
      showError(getErrorMessage(requestError, 'Không thể bán vé tại quầy'));
      await loadSeats(selectedShowtimeId);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <AdminLayout><AdminLoadingSkeleton rows={6} /></AdminLayout>;
  if (error) return <AdminLayout><AdminErrorState onRetry={load} /></AdminLayout>;

  return (
    <AdminLayout>
      <AdminPageHeader title="Bán vé tại quầy" subtitle="Bán vé cho khách vãng lai bằng tiền mặt hoặc chuyển khoản QR." action={<AdminButton variant="outline" icon={RefreshCw} onClick={load}>Làm mới</AdminButton>} />

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <label className="mb-5 block text-sm font-bold text-neutral-800">
            Suất chiếu
            <select value={selectedShowtimeId} onChange={changeShowtime} className="mt-2 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-(--admin-brand)">
              {showtimes.map((showtime) => <option key={showtime.MaSuatChieu} value={showtime.MaSuatChieu}>{showtime.TenPhim} · {formatShowtimeTime(showtime.GioChieu)} · {showtime.TenPhong}</option>)}
            </select>
          </label>

          <SeatLegend className="mb-4 border-y border-neutral-100 py-3" />
          {seatLoading ? <AdminLoadingSkeleton rows={4} /> : seats.length === 0 ? <p className="py-14 text-center text-sm text-neutral-500">Suất chiếu chưa có ghế khả dụng.</p> : (
            <div className="overflow-auto rounded-2xl bg-neutral-50 p-5">
              <div className="mx-auto mb-8 max-w-lg border-b-2 border-neutral-300 pb-2 text-center text-[10px] font-bold uppercase tracking-widest text-neutral-400">Màn hình</div>
              <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
                {seats.map((seat) => (
                  <CinemaSeat
                    key={seat.MaGheSuatChieu}
                    label={seat.TenGhe}
                    typeName={seat.TenLoaiGhe}
                    state={seat.TrangThai === 1 ? 'sold' : seat.TrangThai === 2 ? 'held' : 'available'}
                    selected={selectedSeatIds.includes(seat.MaGheSuatChieu)}
                    disabled={seat.TrangThai !== 0 || seat.KhaDung !== 1}
                    onClick={() => toggleSeat(seat)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="mb-4 flex items-center gap-3"><UserRound className="text-(--admin-brand)" size={20} /><div><h2 className="font-bold text-neutral-950">Khách vãng lai</h2><p className="text-xs text-neutral-500">Thông tin liên hệ không bắt buộc.</p></div></div>
            <div className="space-y-3">
              <input value={guest.name} onChange={(event) => setGuest((current) => ({ ...current, name: event.target.value }))} placeholder="Tên khách hàng" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-(--admin-brand)" />
              <input value={guest.phone} onChange={(event) => setGuest((current) => ({ ...current, phone: event.target.value }))} placeholder="Số điện thoại" inputMode="tel" className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm outline-none focus:border-(--admin-brand)" />
            </div>
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <h2 className="mb-3 font-bold text-neutral-950">Thanh toán</h2>
            <div className="space-y-2">
              {paymentMethods.map(({ id, label, description, icon: Icon }) => {
                const available = id !== 'PAYOS' || payosAvailable;
                return (
                <button key={id} type="button" disabled={!available} onClick={() => setPaymentMethod(id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ring-1 transition disabled:cursor-not-allowed disabled:opacity-45 ${paymentMethod === id ? 'bg-red-50 ring-red-200' : 'bg-neutral-50 ring-neutral-200 hover:bg-white'}`}>
                  <span className="grid size-10 place-items-center rounded-xl bg-white text-(--admin-brand) ring-1 ring-neutral-100"><Icon size={18} /></span>
                  <span><strong className="block text-sm text-neutral-950">{label}</strong><small className="text-[11px] text-neutral-500">{available ? description : 'PayOS chưa được cấu hình'}</small></span>
                </button>
                );
              })}
            </div>
            <dl className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-neutral-500">Suất</dt><dd className="font-semibold text-neutral-900">{selectedShowtime ? `${formatShowtimeTime(selectedShowtime.GioChieu)} · ${selectedShowtime.TenPhong}` : 'Chưa chọn'}</dd></div>
              <div className="flex justify-between"><dt className="text-neutral-500">Ghế</dt><dd className="max-w-48 text-right font-semibold text-neutral-900">{selectedSeats.map((seat) => seat.TenGhe).join(', ') || 'Chưa chọn'}</dd></div>
              <div className="flex justify-between text-base"><dt className="font-bold text-neutral-900">Tạm tính</dt><dd className="font-black text-(--admin-brand)">{formatVND(estimatedTotal)}</dd></div>
            </dl>
            <AdminButton className="mt-5 w-full justify-center" icon={TicketCheck} onClick={submit} disabled={submitting || selectedSeatIds.length === 0}>{submitting ? 'Đang xử lý…' : paymentMethod === 'TIEN_MAT' ? 'Xác nhận đã nhận tiền' : 'Tạo mã chuyển khoản'}</AdminButton>
          </section>

          {result && (
            <section className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-black/5">
              {result.TrangThai === 'CHO_THANH_TOAN' ? (
                <><Clock3 className="mx-auto text-amber-500" size={24} /><h2 className="mt-2 font-bold text-neutral-950">Đang chờ chuyển khoản</h2><p className="mt-1 text-xs text-neutral-500">Hệ thống tự kiểm tra trạng thái mỗi 3 giây.</p>{(result.payment?.qrCode || result.payment?.checkoutUrl) && <div className="mx-auto mt-4 w-fit rounded-xl bg-white p-3 ring-1 ring-neutral-200"><QRCodeSVG value={result.payment.qrCode || result.payment.checkoutUrl} size={210} /></div>}</>
              ) : result.TrangThai === 'DA_THANH_TOAN' ? (
                <><TicketCheck className="mx-auto text-emerald-600" size={26} /><h2 className="mt-2 font-bold text-neutral-950">Vé đã được phát hành</h2><p className="mt-1 text-xs text-neutral-500">Một mã QR dùng cho toàn bộ ghế trong phiếu.</p><div className="mx-auto mt-4 w-fit rounded-xl bg-white p-3 ring-1 ring-neutral-200"><QRCodeSVG value={result.QRPayload} size={210} /></div><code className="mt-3 block break-all text-xs text-neutral-500">{result.MaPhieuDat}</code></>
              ) : <p className="text-sm font-semibold text-red-600">Giao dịch đã kết thúc nhưng chưa phát hành vé.</p>}
            </section>
          )}
        </aside>
      </div>
    </AdminLayout>
  );
};

export default CounterSales;
