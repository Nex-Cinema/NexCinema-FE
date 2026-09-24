import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const PersonnelModal = ({ isOpen, onClose, editingStaff, formData, onChange, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={editingStaff ? 'Cập nhật hồ sơ nhân viên' : 'Thêm nhân viên mới'}>
    <form onSubmit={onSubmit} className="space-y-5">
      {editingStaff && (
        <div className="admin-form-grid">
          <FormField label="Mã nhân viên" helperText="Không thể thay đổi">
            <input disabled readOnly value={editingStaff.MaNhanVien} className="font-mono text-neutral-500" />
          </FormField>
          <FormField label="Mã tài khoản" helperText="Tài khoản liên kết">
            <input disabled readOnly value={editingStaff.MaTaiKhoan || 'Chưa liên kết'} className="font-mono text-neutral-500" />
          </FormField>
        </div>
      )}

      <div className="admin-form-grid">
        <FormField label="Họ tên" required>
          <input
            type="text"
            name="HoTen"
            required
            placeholder="Nguyễn Văn A"
            value={formData.HoTen}
            onChange={onChange}
          />
        </FormField>
        <FormField label="Số điện thoại" required>
          <input
            type="text"
            name="SoDienThoai"
            required
            placeholder="0987654321"
            value={formData.SoDienThoai}
            onChange={onChange}
          />
        </FormField>
      </div>

      <div className="admin-form-grid">
        <FormField label="Email đăng nhập" required>
          <input
            type="email"
            name="Email"
            required
            placeholder="email@cinema.com"
            value={formData.Email}
            onChange={onChange}
          />
        </FormField>
        <FormField label="Mật khẩu" required={!editingStaff} helperText={editingStaff ? 'Để trống nếu không đổi mật khẩu' : undefined}>
          <input
            type="password"
            name="MatKhau"
            required={!editingStaff}
            placeholder="CinemaPlus@2026"
            value={formData.MatKhau}
            onChange={onChange}
          />
        </FormField>
      </div>

      <div className="admin-form-grid">
        <FormField label="Ngày sinh" required>
          <input
            type="date"
            name="NgaySinh"
            required
            value={formData.NgaySinh}
            onChange={onChange}
          />
        </FormField>
        <FormField label="Giới tính">
          <select name="GioiTinh" value={formData.GioiTinh} onChange={onChange}>
            <option value={1}>Nam</option>
            <option value={0}>Nữ</option>
          </select>
        </FormField>
      </div>

      <div className="admin-form-grid">
        <FormField label="Chức vụ" required>
          <input
            type="text"
            name="ChucVu"
            required
            placeholder="VD: Nhân viên quầy vé"
            value={formData.ChucVu}
            onChange={onChange}
          />
        </FormField>
        <FormField label="Trạng thái">
          <select name="KhaDung" value={formData.KhaDung} onChange={onChange}>
            <option value={1}>Khả dụng</option>
            <option value={0}>Chưa khả dụng</option>
          </select>
        </FormField>
      </div>

      {editingStaff && (
        <dl className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
          <div><dt>Ngày tạo</dt><dd className="mt-1 font-semibold text-neutral-700">{editingStaff.NgayTao || '--'}</dd></div>
          <div><dt>Cập nhật</dt><dd className="mt-1 font-semibold text-neutral-700">{editingStaff.NgayCapNhat || 'Chưa cập nhật'}</dd></div>
        </dl>
      )}

      <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
        <AdminButton variant="outline" type="button" onClick={onClose}>Hủy</AdminButton>
        <AdminButton type="submit">{editingStaff ? 'Cập nhật' : 'Thêm nhân viên'}</AdminButton>
      </div>
    </form>
  </Modal>
);

export default PersonnelModal;
