import AdminTable from '../../../components/Admin/Common/AdminTable';
import StatusBadge from '../../../components/Admin/Common/StatusBadge';
import AdminToolbar from '../../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../../components/Admin/Common/AdminPagination';
import AdminFilterSelect from '../../../components/Admin/Common/AdminFilterSelect';
import { formatPrice } from './formatPrice';
import { AlertTriangle, Eye, Check, X } from 'lucide-react';
import Modal from '../../../components/Admin/Common/Modal';
import AdminButton from '../../../components/Admin/Common/AdminButton';
import FormField from '../../../components/Admin/Common/FormField';
import ConfirmDialog from '../../../components/Common/ConfirmDialog';
import useRefundRequests from './useRefundRequests';
import RefundDetailModal from './RefundDetailModal';

export default function RefundRequestsTab({ activeTab }) {
  const model = useRefundRequests(activeTab);
  const { refundRequests, refundLoading, refundPagination, setRefundPagination, refundFilters, setRefundFilters, keywordInput, setKeywordInput, isConfirmApproveOpen, setIsConfirmApproveOpen, isRejectModalOpen, setIsRejectModalOpen, rejectReasonInput, setRejectReasonInput, isActionLoading, handleOpenDetail, handleOpenApproveConfirm, handleApproveSubmit, handleOpenRejectModal, handleRejectSubmit } = model;
  const refundColumns = [
    {
      header: 'Khách hàng',
      render: (r) => {
        const name = r.GiaoDich?.PhieuDatVe?.KhachHang?.TaiKhoan?.HoTen || 'N/A';
        return <span className="font-bold text-slate-200 text-sm">{name}</span>;
      }
    },
    {
      header: 'Phim / suất chiếu',
      render: (r) => {
        const phim = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu?.Phim;
        const room = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu?.PhongChieu;
        const sc = r.GiaoDich?.PhieuDatVe?.ChiTietDatVes?.[0]?.GheSuatChieu?.SuatChieu;
        
        return (
          <div className="flex flex-col max-w-[200px]">
            <span className="font-bold text-slate-300 text-xs truncate" title={phim?.TenPhim || 'N/A'}>
              {phim?.TenPhim || 'N/A'}
            </span>
            <span className="text-[10px] text-slate-500 font-medium font-mono">
              Phòng: {room?.TenPhong || 'N/A'} | {sc ? `${sc.GioChieu.substring(0, 5)} ${sc.NgayChieu}` : ''}
            </span>
          </div>
        );
      }
    },
    {
      header: 'Số tiền hoàn',
      render: (r) => <span className="font-bold font-mono text-emerald-500 text-sm">{formatPrice(r.SoTienHoan)}</span>
    },
    {
      header: 'Lý do',
      render: (r) => (
        <span className="text-xs text-slate-400 truncate max-w-[150px] inline-block font-medium" title={r.LyDo}>
          {r.LyDo}
        </span>
      )
    },
    {
      header: 'Trạng thái',
      render: (r) => <StatusBadge status={r.TrangThai} />
    },
    {
      header: 'Ngày yêu cầu',
      render: (r) => <span className="text-xs text-slate-500 font-mono">{r.NgayTao ? new Date(r.NgayTao).toISOString().replace('T', ' ').substring(0, 19) : '--'}</span>
    },
    {
      header: 'Ngày xử lý',
      render: (r) => <span className="text-xs text-slate-500 font-mono">{r.NgayHoanTien ? new Date(r.NgayHoanTien).toISOString().replace('T', ' ').substring(0, 10) : '--'}</span>
    },
    {
      header: 'Thao tác',
      className: 'text-right',
      render: (r) => (
        <div className="flex justify-end gap-1.5">
          <button 
            onClick={() => handleOpenDetail(r)}
            className="p-2 hover:bg-white/5 border border-transparent hover:border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Chi tiết"
            aria-label="Xem chi tiết yêu cầu hoàn tiền"
          >
            <Eye size={16} />
          </button>
          {r.TrangThai === 'CHO_XU_LY' ? (
            <>
              <button 
                onClick={() => handleOpenApproveConfirm(r)}
                className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-emerald-500/20 text-xs font-bold"
                title="Duyệt"
              >
                <Check size={14} />
                <span>Duyệt</span>
              </button>
              <button 
                onClick={() => handleOpenRejectModal(r)}
                className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-red-500/20 text-xs font-bold"
                title="Từ chối"
              >
                <X size={14} />
                <span>Từ chối</span>
              </button>
            </>
          ) : (
            <span className="text-xs text-slate-600 font-semibold px-2 py-1 select-none">Đã xử lý</span>
          )}
        </div>
      )
    }
  ];


  return (<>
          {/* Refund Requests Filters */}
          <AdminToolbar
            searchPlaceholder="Tìm theo mã hoàn tiền, mã vé, khách hàng, lý do..."
            searchValue={keywordInput}
            onSearchChange={setKeywordInput}
            filterSlot={
              <AdminFilterSelect
                aria-label="Lọc yêu cầu hoàn tiền theo trạng thái"
                value={refundFilters.trangThai}
                onChange={e => {
                  setRefundFilters(prev => ({ ...prev, trangThai: e.target.value }));
                  setRefundPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="CHO_XU_LY">Chờ xử lý (CHO_XU_LY)</option>
                <option value="DA_HOAN">Đã hoàn (DA_HOAN)</option>
                <option value="TU_CHOI">Từ chối (TU_CHOI)</option>
              </AdminFilterSelect>
            }
          />

          {/* Refund Requests Table */}
          {refundLoading ? (
            <div className="bg-white/5 border border-white/5 rounded-3xl h-64 animate-pulse" />
          ) : refundRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white/[0.02] border border-white/10 rounded-3xl text-sm font-semibold">
              Không tìm thấy dữ liệu phù hợp
            </div>
          ) : (
            <>
              <div className="overflow-x-auto w-full custom-scrollbar">
                <AdminTable columns={refundColumns} data={refundRequests} rowKey="MaHoanTien" />
              </div>
              <AdminPagination
                page={refundPagination.page}
                pageSize={refundPagination.limit}
                total={refundPagination.total}
                onPageChange={(p) => setRefundPagination(prev => ({ ...prev, page: p }))}
                onPageSizeChange={(s) => setRefundPagination(prev => ({ ...prev, limit: s, page: 1 }))}
              />
            </>
          )}
    <RefundDetailModal {...model} />
      {/* Reject Reason Form Modal */}
      <Modal 
        isOpen={isRejectModalOpen} 
        onClose={() => setIsRejectModalOpen(false)} 
        title="Từ chối yêu cầu hoàn tiền"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800">
            <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
            <p>
              Hành động này sẽ từ chối đơn hoàn tiền. Trạng thái yêu cầu hoàn tiền chuyển thành &quot;Từ chối&quot;. Vé và giao dịch đặt vé vẫn sẽ ở trạng thái đã hủy (hoặc giữ nguyên).
            </p>
          </div>

          <FormField label="Lý do từ chối (LyDoTuChoi)" required helperText="Ghi rõ lý do không chấp thuận hoàn tiền cho yêu cầu này">
            <textarea 
              required
              className="min-h-[90px] resize-y"
              placeholder="Nhập lý do từ chối hoàn tiền..."
              value={rejectReasonInput}
              onChange={e => setRejectReasonInput(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <AdminButton 
              type="button" 
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
            >
              Đóng
            </AdminButton>
            <AdminButton 
              type="button"
              variant="danger"
              disabled={!rejectReasonInput.trim() || isActionLoading}
              onClick={handleRejectSubmit}
            >
              {isActionLoading ? 'Đang xử lý...' : 'Xác nhận từ chối'}
            </AdminButton>
          </div>
        </div>
      </Modal>

      {/* Confirm Dialog for Approve */}
      <ConfirmDialog 
        isOpen={isConfirmApproveOpen}
        title="Xác nhận duyệt yêu cầu hoàn tiền"
        message="Chỉ xác nhận sau khi đã hoàn tiền thủ công. Hệ thống ghi nhận kết quả và hủy vé; thao tác này không tự chuyển tiền."
        confirmText="Xác nhận duyệt"
        cancelText="Quay lại"
        variant="warning"
        isLoading={isActionLoading}
        onConfirm={handleApproveSubmit}
        onCancel={() => setIsConfirmApproveOpen(false)}
      />

  </>);
}
