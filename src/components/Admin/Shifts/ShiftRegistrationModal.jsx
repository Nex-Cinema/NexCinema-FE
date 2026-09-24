import { AlertTriangle } from 'lucide-react';
import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const ShiftRegistrationModal = ({ isOpen, onClose, formData, onChange, onSubmit, staffList, shifts }) => {
  const activeShifts = shifts.filter((s) => s.KhaDung === 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Đăng ký ca làm việc mới">
      {staffList.length === 0 || activeShifts.length === 0 ? (
        <div className="space-y-4 py-6 text-center">
          <AlertTriangle className="mx-auto text-amber-500" size={40} />
          <p className="text-sm text-neutral-600">Cần có ít nhất 1 nhân sự đang hoạt động và 1 ca làm việc khả dụng để phân ca.</p>
          <div className="flex justify-center pt-2">
            <AdminButton variant="outline" type="button" onClick={onClose}>Đóng</AdminButton>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <FormField label="Chọn Nhân viên" required>
            <select
              required
              value={formData.MaNhanVien}
              onChange={(e) => onChange('MaNhanVien', e.target.value)}
            >
              {staffList.map((s) => (
                <option key={s.MaNhanVien} value={s.MaNhanVien}>
                  {s.HoTen} ({s.ChucVu}) - {s.MaNhanVien}
                </option>
              ))}
            </select>
          </FormField>

          <div className="admin-form-grid">
            <FormField label="Chọn Ca làm việc" required>
              <select
                required
                value={formData.MaCaLamViec}
                onChange={(e) => onChange('MaCaLamViec', e.target.value)}
              >
                {activeShifts.map((s) => (
                  <option key={s.MaCaLamViec} value={s.MaCaLamViec}>
                    {s.TenCa} ({s.GioBatDau.substring(0, 5)} - {s.GioKetThuc.substring(0, 5)})
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Ngày làm việc" required>
              <input
                type="date"
                required
                value={formData.NgayLam}
                onChange={(e) => onChange('NgayLam', e.target.value)}
              />
            </FormField>
          </div>

          <div className="admin-form-grid">
            <FormField label="Kiểu lặp lại">
              <select
                value={formData.KieuLap}
                onChange={(e) => onChange('KieuLap', e.target.value)}
              >
                <option value="">Không lặp</option>
                <option value={1}>Hàng tuần</option>
                <option value={2}>Hàng ngày</option>
              </select>
            </FormField>

            <FormField label="Ngày lặp cuối" required={formData.KieuLap !== ''} helperText={formData.KieuLap === '' ? 'Chỉ áp dụng khi chọn kiểu lặp' : undefined}>
              <input
                type="date"
                disabled={formData.KieuLap === ''}
                required={formData.KieuLap !== ''}
                value={formData.NgayLap}
                onChange={(e) => onChange('NgayLap', e.target.value)}
              />
            </FormField>
          </div>

          <FormField label="Ghi chú">
            <textarea
              rows={2}
              placeholder="VD: Trực quầy vé, hỗ trợ soát vé..."
              value={formData.GhiChu}
              onChange={(e) => onChange('GhiChu', e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <AdminButton variant="outline" type="button" onClick={onClose}>Hủy</AdminButton>
            <AdminButton type="submit">Đăng ký ca</AdminButton>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default ShiftRegistrationModal;
