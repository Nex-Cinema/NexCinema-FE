import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const CATEGORY_LABELS = { room: 'Loại phòng', seat: 'Hạng ghế', day: 'Loại ngày' };
const PLACEHOLDERS = { room: 'VD: IMAX', seat: 'VD: VIP', day: 'VD: Ngày cuối tuần' };

const PricingModal = ({ isOpen, onClose, modalCategory, editingItem, formData, onChange, onSubmit }) => {
  const catLabel = CATEGORY_LABELS[modalCategory] || '';
  const editId = editingItem?.MaLoaiPhong || editingItem?.MaLoaiGhe || editingItem?.MaLoaiNgay;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingItem ? `Chỉnh sửa ${catLabel}` : `Thêm ${catLabel} mới`}>
      <form onSubmit={onSubmit} className="space-y-5">
        {editingItem && (
          <FormField label="Mã cấu hình" helperText="Mã định danh không thể thay đổi">
            <input disabled readOnly value={editId} className="font-mono text-neutral-500" />
          </FormField>
        )}

        <div className="admin-form-grid">
          <FormField label="Tên hiển thị" required>
            <input
              type="text"
              required
              placeholder={PLACEHOLDERS[modalCategory]}
              value={formData.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </FormField>

          <FormField label="Giá phụ thu (đ)" required>
            <input
              type="number"
              required
              min="0"
              step="1000"
              placeholder="Nhập số tiền phụ thu..."
              value={formData.surcharge}
              onChange={(e) => onChange('surcharge', e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Mô tả">
          <textarea
            rows={3}
            placeholder="Nhập mô tả..."
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </FormField>

        <FormField label="Trạng thái">
          <select
            value={formData.KhaDung}
            onChange={(e) => onChange('KhaDung', parseInt(e.target.value, 10))}
          >
            <option value={1}>Khả dụng</option>
            <option value={0}>Chưa khả dụng</option>
          </select>
        </FormField>

        {editingItem && (
          <dl className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
            <div><dt>Ngày tạo</dt><dd className="mt-1 font-semibold text-neutral-700">{editingItem.NgayTao || '--'}</dd></div>
            <div><dt>Cập nhật</dt><dd className="mt-1 font-semibold text-neutral-700">{editingItem.NgayCapNhat || 'Chưa cập nhật'}</dd></div>
          </dl>
        )}

        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
          <AdminButton variant="outline" type="button" onClick={onClose}>Hủy</AdminButton>
          <AdminButton type="submit">{editingItem ? 'Cập nhật' : 'Thêm mới'}</AdminButton>
        </div>
      </form>
    </Modal>
  );
};

export default PricingModal;
