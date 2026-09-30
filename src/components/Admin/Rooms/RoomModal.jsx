import { AlertCircle } from 'lucide-react';
import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const RoomModal = ({ isOpen, editingRoom, formData, errors, roomTypes, seatMaps, onChange, onSubmit, onClose }) => {
  const seatMap = seatMaps.find((item) => item.MaSoDoGhe === formData.MaSoDoGhe);
  const seatCount = seatMap ? seatMap.TongHang * seatMap.TongCot : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingRoom ? 'Cập nhật phòng chiếu' : 'Thêm phòng chiếu mới'}>
      <form onSubmit={onSubmit} className="space-y-5">
        {errors.submit && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs text-red-700" role="alert">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errors.submit}</span>
          </div>
        )}

        <FormField label="Tên phòng chiếu" required>
          <input name="TenPhong" required value={formData.TenPhong} onChange={onChange} placeholder="VD: Phòng chiếu 01" />
        </FormField>

        <div className="admin-form-grid">
          <FormField label="Loại phòng" required>
            <select name="MaLoaiPhong" value={formData.MaLoaiPhong} onChange={onChange}>
              {roomTypes.map((type) => <option key={type.MaLoaiPhong} value={type.MaLoaiPhong}>{type.TenLoaiPhong}</option>)}
            </select>
          </FormField>
          <FormField label="Sơ đồ ghế" required>
            <select name="MaSoDoGhe" value={formData.MaSoDoGhe} onChange={onChange}>
              {seatMaps.map((map) => <option key={map.MaSoDoGhe} value={map.MaSoDoGhe}>{map.TenSoDo || map.MaSoDoGhe} ({map.TongHang}×{map.TongCot})</option>)}
            </select>
          </FormField>
          <FormField label="Số ghế" helperText="Tự tính theo sơ đồ đã chọn">
            <input readOnly value={`${seatCount} ghế`} />
          </FormField>
          <FormField label="Trạng thái">
            <select name="KhaDung" value={formData.KhaDung} onChange={onChange}>
              <option value={1}>Khả dụng</option>
              <option value={0}>Chưa khả dụng</option>
            </select>
          </FormField>
        </div>

        {editingRoom && (
          <dl className="grid grid-cols-2 gap-4 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-500">
            <div><dt>Ngày tạo</dt><dd className="mt-1 font-semibold text-neutral-700">{editingRoom.NgayTao || '--'}</dd></div>
            <div><dt>Cập nhật</dt><dd className="mt-1 font-semibold text-neutral-700">{editingRoom.NgayCapNhat || 'Chưa cập nhật'}</dd></div>
          </dl>
        )}

        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
          <AdminButton variant="outline" onClick={onClose}>Hủy</AdminButton>
          <AdminButton type="submit">{editingRoom ? 'Cập nhật' : 'Thêm phòng'}</AdminButton>
        </div>
      </form>
    </Modal>
  );
};

export default RoomModal;
