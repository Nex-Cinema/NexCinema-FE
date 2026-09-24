import Modal from '../../../components/Admin/Common/Modal';
import StatusBadge from '../../../components/Admin/Common/StatusBadge';
import AdminButton from '../../../components/Admin/Common/AdminButton';
import { getPaymentMethodLabel } from '../../../utils/paymentMethodHelper';
import { showSuccess } from '../../../utils/toastHelper';
import { formatPrice } from './formatPrice';

export default function RefundDetailModal({
  isDetailModalOpen,
  setIsDetailModalOpen,
  activeRefund,
  handleOpenApproveConfirm,
  handleOpenRejectModal,
}) {
  return (
    <Modal
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      title="Chi tiết yêu cầu hoàn tiền"
    >
      {activeRefund && (
        <div className="space-y-4">
          {/* Customer Information */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200/60 pb-2">
              Thông tin khách hàng
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block mb-0.5">Họ tên:</span>
                <span className="text-neutral-900 font-semibold">
                  {activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.HoTen || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Số điện thoại:</span>
                <span className="text-neutral-900 font-semibold font-mono">
                  {activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.SoDienThoai || 'N/A'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 block mb-0.5">Email:</span>
                <span className="text-neutral-900 font-semibold font-mono">
                  {activeRefund.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.Email || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket & Transaction Information */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200/60 pb-2">
              Thông tin vé & giao dịch
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-neutral-500 block mb-0.5">Mã phiếu đặt:</span>
                <span
                  className="text-red-600 font-semibold font-mono text-xs truncate block max-w-[200px]"
                  title={activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat || 'N/A'}
                >
                  {activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Mã giao dịch:</span>
                <span
                  className="text-neutral-900 font-semibold font-mono text-xs truncate block max-w-[200px]"
                  title={activeRefund.GiaoDich?.MaGiaoDich || 'N/A'}
                >
                  {activeRefund.GiaoDich?.MaGiaoDich || 'N/A'}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Phương thức:</span>
                <span className="text-neutral-900 font-semibold">
                  {getPaymentMethodLabel(activeRefund.GiaoDich?.PhuongThuc || 'N/A')}
                </span>
              </div>
              <div>
                <span className="text-neutral-500 block mb-0.5">Mã giao dịch ngoài:</span>
                <span
                  className="text-neutral-900 font-semibold font-mono text-xs truncate block max-w-[200px]"
                  title={activeRefund.GiaoDich?.MaGiaoDichNgoai || '--'}
                >
                  {activeRefund.GiaoDich?.MaGiaoDichNgoai || '--'}
                </span>
              </div>
            </div>
          </div>

          {/* Movie details */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 border-b border-neutral-200/60 pb-2">
              Suất chiếu & Ghế đặt
            </h4>
            {(() => {
              const firstDetail = activeRefund.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0];
              const phim = firstDetail?.GheSuatChieu?.SuatChieu?.Phim;
              const room = firstDetail?.GheSuatChieu?.SuatChieu?.PhongChieu;
              const sc = firstDetail?.GheSuatChieu?.SuatChieu;
              const seatsList =
                activeRefund.GiaoDich?.PhieuDatVe?.ChiTietDatVes
                  ?.map((ct) => {
                    const ghe = ct.GheSuatChieu?.Ghe;
                    return ghe ? `${ghe.ViTriDay}${ghe.ViTriCot}` : '';
                  })
                  .filter(Boolean)
                  .join(', ') || 'N/A';

              return (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phim:</span>
                    <span className="text-neutral-900 font-semibold">
                      {phim?.TenPhim || 'N/A'} ({phim?.ThoiLuong || 0} phút)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Phòng chiếu:</span>
                    <span className="text-neutral-900 font-semibold">{room?.TenPhong || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Thời gian:</span>
                    <span className="text-neutral-900 font-semibold font-mono">
                      {sc ? `${sc.GioChieu.substring(0, 5)} - ${sc.NgayChieu}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-neutral-200/60">
                    <span className="text-neutral-500">Danh sách ghế:</span>
                    <span className="text-amber-800 font-bold">{seatsList}</span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Customer Bank Info & VietQR */}
          {activeRefund.SoTaiKhoan && activeRefund.TenNganHang && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 space-y-3">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider border-b border-amber-200/70 pb-2">
                Thông tin hoàn tiền & mã VietQR
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-600 block mb-0.5">Ngân hàng nhận:</span>
                    <span className="text-neutral-900 font-semibold">{activeRefund.TenNganHang}</span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block mb-0.5">Số tài khoản:</span>
                    <span className="text-neutral-900 font-bold font-mono text-sm select-all inline-flex items-center gap-1.5">
                      {activeRefund.SoTaiKhoan}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeRefund.SoTaiKhoan);
                          showSuccess('Đã sao chép số tài khoản!');
                        }}
                        className="text-xs text-red-600 hover:underline font-semibold cursor-pointer"
                      >
                        (Sao chép)
                      </button>
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-600 block mb-0.5">Chủ tài khoản:</span>
                    <span className="text-neutral-900 font-semibold uppercase">{activeRefund.TenChuTaiKhoan}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-neutral-600 block mb-0.5">Số tiền hoàn:</span>
                    <span className="text-red-600 font-bold text-base font-mono">
                      {formatPrice(activeRefund.SoTienHoan)}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-amber-200 shrink-0 self-center shadow-xs">
                  <img
                    src={`https://img.vietqr.io/image/${(() => {
                      const lower = activeRefund.TenNganHang.toLowerCase();
                      if (lower.includes('mbbank') || lower.includes('quân đội') || lower === 'mb') return 'mbbank';
                      if (lower.includes('vietcombank') || lower.includes('ngoại thương') || lower === 'vcb') return 'vietcombank';
                      if (lower.includes('techcombank') || lower.includes('kỹ thương') || lower === 'tcb') return 'techcombank';
                      if (lower.includes('bidv') || lower.includes('đầu tư') || lower === 'bidv') return 'bidv';
                      if (lower.includes('vietinbank') || lower.includes('công thương') || lower === 'ctg') return 'vietinbank';
                      if (lower.includes('agribank') || lower.includes('nông nghiệp') || lower === 'agr') return 'agribank';
                      if (lower.includes('acb') || lower.includes('á châu') || lower === 'acb') return 'acb';
                      if (lower.includes('tpbank') || lower.includes('tiên phong') || lower === 'tpb') return 'tpbank';
                      if (lower.includes('vpbank') || lower.includes('thịnh vượng') || lower === 'vpb') return 'vpbank';
                      if (lower.includes('sacombank') || lower.includes('sài gòn thương tín') || lower === 'stb') return 'sacombank';
                      return lower.replace(/[^a-z0-9]/g, '');
                    })()}-${activeRefund.SoTaiKhoan}-compact.png?amount=${activeRefund.SoTienHoan}&addInfo=${encodeURIComponent(
                      `Hoan tien ve ${activeRefund.GiaoDich?.PhieuDatVe?.MaPhieuDat?.substring(0, 8) || ''}`
                    )}&accountName=${encodeURIComponent(activeRefund.TenChuTaiKhoan)}`}
                    alt="VietQR Code"
                    className="w-36 h-36 object-contain"
                    loading="lazy"
                  />
                  <span className="text-[10px] text-neutral-500 font-medium mt-1">Quét QR chuyển khoản nhanh</span>
                </div>
              </div>
            </div>
          )}

          {/* Refund detail info */}
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Mã hoàn tiền:</span>
              <span className="text-neutral-900 font-semibold font-mono text-xs truncate max-w-[200px]" title={activeRefund.MaHoanTien}>
                {activeRefund.MaHoanTien}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Số tiền hoàn:</span>
              <span className="text-red-600 font-bold text-sm font-mono">{formatPrice(activeRefund.SoTienHoan)}</span>
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <span className="text-neutral-500">Lý do hoàn trả của khách hàng:</span>
              <div className="rounded-lg border border-neutral-200 bg-white p-3 font-medium text-neutral-800 whitespace-pre-wrap">
                {activeRefund.LyDo}
              </div>
            </div>
            <div className="flex justify-between items-center pt-1">
              <span className="text-neutral-500">Trạng thái:</span>
              <StatusBadge status={activeRefund.TrangThai} />
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Ngày yêu cầu:</span>
              <span className="text-neutral-900 font-medium">
                {activeRefund.NgayTao ? new Date(activeRefund.NgayTao).toLocaleString('vi-VN') : '--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Ngày xử lý:</span>
              <span className="text-neutral-900 font-medium">
                {activeRefund.NgayHoanTien ? new Date(activeRefund.NgayHoanTien).toLocaleDateString('vi-VN') : '--'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <AdminButton
              type="button"
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Đóng
            </AdminButton>
            {activeRefund.TrangThai === 'CHO_XU_LY' && (
              <>
                <AdminButton
                  type="button"
                  variant="outline"
                  className="!border-emerald-600 !bg-emerald-600 !text-white hover:!bg-emerald-700"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenApproveConfirm(activeRefund);
                  }}
                >
                  Duyệt hoàn tiền
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="danger"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenRejectModal(activeRefund);
                  }}
                >
                  Từ chối
                </AdminButton>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
