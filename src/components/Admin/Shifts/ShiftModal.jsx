import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const ShiftModal = ({ isOpen, onClose, editingShift, formData, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingShift ? 'Sửa thông tin ca làm việc' : 'Thêm ca làm việc mới'}>
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
      {editingShift && (
        <FormField label="Mã ca" helperText="Không thể thay đổi">
          <input disabled readOnly value={editingShift.MaCaLamViec} className="font-mono text-neutral-500" />
        </FormField>
      )}

      <FormField label="Tên ca làm việc" required>
        <input
          type="text"
          required
          placeholder="VD: Ca Sáng, Ca Chiều, Ca Tối"
          value={formData.TenCa}
          onChange={(e) => onChange('TenCa', e.target.value)}
        />
      </FormField>

      <div className="admin-form-grid">
        <FormField label="Giờ bắt đầu" required>
          <input
            type="time"
            required
            value={formData.GioBatDau}
            onChange={(e) => onChange('GioBatDau', e.target.value)}
          />
        </FormField>
        <FormField label="Giờ kết thúc" required>
          <input
            type="time"
            required
            value={formData.GioKetThuc}
            onChange={(e) => onChange('GioKetThuc', e.target.value)}
          />
        </FormField>
      </div>

      <div className="admin-form-grid">
        <FormField label="Số người tối đa" required>
          <input
            type="number"
            min="1"
            required
            placeholder="5"
            value={formData.SoNguoiToiDa}
            onChange={(e) => onChange('SoNguoiToiDa', e.target.value)}
          />
        </FormField>
        <FormField label="Trạng thái">
          <select
            value={formData.KhaDung}
            onChange={(e) => onChange('KhaDung', parseInt(e.target.value, 10))}
          >
            <option value={1}>Khả dụng</option>
            <option value={0}>Vô hiệu</option>
          </select>
        </FormField>
      </div>

      {editingShift && (
        <dl className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
          <div><dt>Ngày tạo</dt><dd className="mt-1 font-semibold text-neutral-700">{editingShift.NgayTao || '--'}</dd></div>
          <div><dt>Cập nhật</dt><dd className="mt-1 font-semibold text-neutral-700">{editingShift.NgayCapNhat || 'Chưa cập nhật'}</dd></div>
        </dl>
      )}

      <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
        <AdminButton variant="outline" type="button" onClick={onClose}>Hủy</AdminButton>
        <AdminButton type="submit">{editingShift ? 'Lưu thay đổi' : 'Thêm ca'}</AdminButton>
      </div>
    </form>
  </Modal>
);

export default ShiftModal;
