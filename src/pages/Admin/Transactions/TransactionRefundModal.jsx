import Modal from '../../../components/Admin/Common/Modal';
import AdminButton from '../../../components/Admin/Common/AdminButton';
import FormField from '../../../components/Admin/Common/FormField';
import { AlertTriangle } from 'lucide-react';
import { formatPrice } from './formatPrice';

export default function TransactionRefundModal({
  isRefundModalOpen,
  setIsRefundModalOpen,
  selectedTx,
  refundReason,
  setRefundReason,
  handleRefundSubmit,
  isSubmitting,
}) {
  return (
    <Modal
      isOpen={isRefundModalOpen}
      onClose={() => setIsRefundModalOpen(false)}
      title="Yêu cầu hủy đặt vé & hoàn tiền"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800">
          <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
          <p>
            Chỉ xác nhận sau khi đã hoàn tiền thủ công. Hệ thống ghi nhận kết quả, hủy vé và giải phóng ghế còn thuộc phiếu đặt; không tự chuyển tiền qua ngân hàng hoặc cổng thanh toán.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Khách hàng:</span>
            <span className="font-semibold text-neutral-900">{selectedTx?.KhachHang}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Nội dung vé:</span>
            <span className="font-semibold text-neutral-900 text-right truncate max-w-[220px]" title={selectedTx?.Phim}>
              {selectedTx?.Phim}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Ghế đã chọn:</span>
            <span className="font-semibold text-neutral-900">{selectedTx?.Ghe}</span>
          </div>
          <div className="flex justify-between pt-2.5 border-t border-neutral-200/60">
            <span className="text-neutral-500">Số tiền hoàn:</span>
            <span className="font-bold text-red-600 text-sm font-mono">
              {selectedTx && formatPrice(selectedTx.SoTien)}
            </span>
          </div>
        </div>

        <FormField label="Lý do hoàn trả (LyDoHoan)" required helperText="Ghi rõ lý do hoàn tiền cho phiếu đặt này">
          <textarea
            required
            className="min-h-[90px] resize-y"
            placeholder="Nhập lý do hoàn tiền chi tiết..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
          />
        </FormField>

        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
          <AdminButton
            type="button"
            variant="outline"
            onClick={() => setIsRefundModalOpen(false)}
          >
            Đóng
          </AdminButton>
          <AdminButton
            type="button"
            variant="danger"
            disabled={!refundReason.trim() || isSubmitting}
            onClick={handleRefundSubmit}
          >
            {isSubmitting ? 'Đang ghi nhận...' : 'Xác nhận đã hoàn tiền'}
          </AdminButton>
        </div>
      </div>
    </Modal>
  );
}
