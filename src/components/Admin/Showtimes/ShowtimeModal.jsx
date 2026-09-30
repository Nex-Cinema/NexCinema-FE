import { AlertCircle, Save } from 'lucide-react';
import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const FORM_ID = 'admin-showtime-form';

const ShowtimeModal = ({
  isOpen,
  onClose,
  editingShowtime,
  formData,
  conflict,
  submitting,
  movies,
  rooms,
  dayTypes,
  onFormChange,
  onSubmit,
}) => {
  const selectedMovie = movies.find((movie) => movie.MaPhim === formData.MaPhim);
  const selectedRoom = rooms.find((room) => room.MaPhongChieu === formData.MaPhongChieu);
  const modalDescription = [selectedMovie?.TenPhim, selectedRoom?.TenPhong].filter(Boolean).join(' · ') || 'Thiết lập phim, phòng chiếu và khung giờ.';

  const footer = (
    <>
      <span className={`admin-modal-footer-note ${conflict ? 'admin-modal-footer-note--danger' : ''}`}>
        {conflict ? 'Cần xử lý xung đột lịch trước khi lưu' : 'Giờ kết thúc được tính tự động theo thời lượng phim'}
      </span>
      <div>
        <AdminButton variant="ghost" onClick={onClose} disabled={submitting}>Hủy</AdminButton>
        <AdminButton type="submit" form={FORM_ID} icon={Save} disabled={Boolean(conflict) || submitting}>
          {submitting ? 'Đang lưu…' : editingShowtime ? 'Lưu thay đổi' : 'Thêm suất chiếu'}
        </AdminButton>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingShowtime ? 'Cập nhật suất chiếu' : 'Thêm suất chiếu mới'}
      description={modalDescription}
      size="medium"
      bodyClassName="admin-showtime-modal-body"
      footer={footer}
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="admin-showtime-form">
        <fieldset disabled={submitting}>
          <section className="admin-showtime-form-section">
            <div className="admin-movie-section-heading"><span>01</span><h4>Phim & phòng chiếu</h4><p>Chọn nội dung và không gian chiếu phù hợp.</p></div>
            <div className="admin-form-grid">
              <FormField label="Phim" required className="sm:col-span-2">
                <select required value={formData.MaPhim} onChange={(event) => onFormChange('MaPhim', event.target.value)}>
                  {movies.length === 0 && <option value="">Chưa có phim khả dụng</option>}
                  {movies.map((movie) => <option key={movie.MaPhim} value={movie.MaPhim}>{movie.TenPhim} · {movie.ThoiLuong} phút</option>)}
                </select>
              </FormField>
              <FormField label="Phòng chiếu" required>
                <select required value={formData.MaPhongChieu} onChange={(event) => onFormChange('MaPhongChieu', event.target.value)}>
                  {rooms.length === 0 && <option value="">Chưa có phòng khả dụng</option>}
                  {rooms.map((room) => <option key={room.MaPhongChieu} value={room.MaPhongChieu}>{room.TenPhong}</option>)}
                </select>
              </FormField>
              <FormField label="Loại ngày" required>
                <select required value={formData.MaLoaiNgay} onChange={(event) => onFormChange('MaLoaiNgay', event.target.value)}>
                  {dayTypes.length === 0 && <option value="">Chưa có loại ngày</option>}
                  {dayTypes.map((dayType) => <option key={dayType.MaLoaiNgay} value={dayType.MaLoaiNgay}>{dayType.TenLoaiNgay}</option>)}
                </select>
              </FormField>
            </div>
          </section>

          <section className="admin-showtime-form-section">
            <div className="admin-movie-section-heading"><span>02</span><h4>Ngày & khung giờ</h4><p>Hệ thống tự kiểm tra lịch trùng theo phòng chiếu.</p></div>
            <div className="admin-showtime-time-grid">
              <FormField label="Ngày chiếu" required>
                <input type="date" required value={formData.NgayChieu} onChange={(event) => onFormChange('NgayChieu', event.target.value)} />
              </FormField>
              <FormField label="Giờ bắt đầu" required>
                <input type="time" required value={formData.GioChieu} onChange={(event) => onFormChange('GioChieu', event.target.value)} />
              </FormField>
              <FormField label="Giờ kết thúc" helperText="Tự động tính">
                <input type="time" readOnly value={formData.GioKetThuc} />
              </FormField>
            </div>
            {conflict && (
              <div className="admin-form-alert admin-form-alert--showtime" role="alert">
                <AlertCircle size={18} strokeWidth={1.7} />
                <div><strong>Xung đột lịch chiếu</strong><p>{conflict}</p></div>
              </div>
            )}
          </section>

          <section className="admin-showtime-form-section">
            <div className="admin-movie-section-heading"><span>03</span><h4>Giá vé & trạng thái</h4></div>
            <div className="admin-form-grid">
              <FormField label="Giá vé cơ bản" required helperText="Đơn vị: VNĐ">
                <div className="admin-input-affix"><span>₫</span><input type="number" min="0" step="1000" required value={formData.GiaVeCoBan} onChange={(event) => onFormChange('GiaVeCoBan', event.target.value)} /></div>
              </FormField>
              <FormField label="Trạng thái vận hành" required>
                <select value={formData.KhaDung} onChange={(event) => onFormChange('KhaDung', Number(event.target.value))}>
                  <option value={1}>Đang mở bán</option>
                  <option value={0}>Tạm khóa</option>
                </select>
              </FormField>
            </div>
          </section>
        </fieldset>

        {editingShowtime && (
          <div className="admin-movie-audit">
            <span>Ngày tạo <strong>{editingShowtime.NgayTao || 'Chưa có dữ liệu'}</strong></span>
            <span>Cập nhật gần nhất <strong>{editingShowtime.NgayCapNhat || 'Chưa cập nhật'}</strong></span>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default ShowtimeModal;
