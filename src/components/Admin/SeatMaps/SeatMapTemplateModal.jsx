import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const SeatMapTemplateModal = ({ isOpen, editingTemplate, formData, onChange, onSubmit, onClose }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={editingTemplate ? 'Cập nhật sơ đồ mẫu' : 'Tạo sơ đồ mẫu mới'}
  >
    <form onSubmit={onSubmit} className="space-y-5">
      <FormField label="Mã sơ đồ" required>
        <input
          name="MaSoDoGhe"
          required
          value={formData.MaSoDoGhe}
          onChange={onChange}
          placeholder="VD: SM10x12"
          disabled={Boolean(editingTemplate)}
        />
      </FormField>

      <div className="admin-form-grid">
        <FormField label="Tổng số hàng" required>
          <input type="number" name="TongHang" min="1" required value={formData.TongHang} onChange={onChange} />
        </FormField>
        <FormField label="Tổng số cột" required>
          <input type="number" name="TongCot" min="1" required value={formData.TongCot} onChange={onChange} />
        </FormField>
      </div>

      <FormField label="Cấu trúc (JSON)" helperText="Định nghĩa vị trí lối đi (aisles) theo cột hoặc hàng.">
        <textarea name="CauTruc" value={formData.CauTruc} onChange={onChange} spellCheck="false" />
      </FormField>

      {editingTemplate && (
        <FormField label="Trạng thái">
          <select name="KhaDung" value={formData.KhaDung} onChange={onChange}>
            <option value={1}>Khả dụng</option>
            <option value={0}>Chưa khả dụng</option>
          </select>
        </FormField>
      )}

      <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
        <AdminButton variant="outline" onClick={onClose}>Hủy</AdminButton>
        <AdminButton type="submit">Lưu mẫu</AdminButton>
      </div>
    </form>
  </Modal>
);

export default SeatMapTemplateModal;
