import { useState } from 'react';
import { AlertCircle, Film, Save } from 'lucide-react';
import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';
import RichTextEditor from '../Common/RichTextEditor';

const FORM_ID = 'admin-movie-form';

const PosterPreview = ({ src, title }) => {
  const [failedSrc, setFailedSrc] = useState('');
  const canShowImage = Boolean(src) && failedSrc !== src;

  return (
    <div className="admin-movie-poster" data-empty={!canShowImage}>
      {canShowImage ? (
        <img src={src} alt={`Poster ${title || 'phim'}`} onError={() => setFailedSrc(src)} />
      ) : (
        <div><Film size={30} strokeWidth={1.5} /><strong>Chưa có poster</strong><span>Dán URL ảnh để xem trước</span></div>
      )}
    </div>
  );
};

const MovieModal = ({ isOpen, onClose, editingMovie, formData, errors, onChange, onSubmit, isSubmitting = false }) => {
  const title = editingMovie ? 'Cập nhật phim' : 'Thêm phim mới';
  const richTextChange = (event) => onChange({ target: { name: 'NoiDung', value: event.target.value } });

  const footer = (
    <>
      <span className="admin-modal-footer-note">Các trường có dấu * là bắt buộc</span>
      <div>
        <AdminButton variant="ghost" onClick={onClose} disabled={isSubmitting}>Hủy</AdminButton>
        <AdminButton type="submit" form={FORM_ID} icon={Save} disabled={isSubmitting}>
          {isSubmitting ? 'Đang lưu…' : editingMovie ? 'Lưu thay đổi' : 'Thêm phim'}
        </AdminButton>
      </div>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description="Hoàn thiện thông tin hiển thị và lịch phát hành của phim."
      size="wide"
      bodyClassName="admin-movie-modal-body"
      footer={footer}
    >
      <form id={FORM_ID} onSubmit={onSubmit} className="admin-movie-form">
        {errors?.submit && (
          <div className="admin-form-alert" role="alert">
            <AlertCircle size={17} strokeWidth={1.7} />
            <span>{errors.submit}</span>
          </div>
        )}

        <fieldset disabled={isSubmitting} className="admin-movie-modal-grid">
          <aside className="admin-movie-media-panel">
            <div className="admin-movie-section-heading">
              <span>Hình ảnh</span>
              <h4>Poster phim</h4>
              <p>Tỷ lệ 2:3, ưu tiên ảnh JPG hoặc WEBP rõ nét.</p>
            </div>
            <PosterPreview src={formData.HinhAnh} title={formData.TenPhim} />
            <FormField label="URL poster" helperText="Ảnh sẽ được kiểm tra ngay khi đường dẫn thay đổi.">
              <input type="url" name="HinhAnh" placeholder="https://.../poster.jpg" value={formData.HinhAnh} onChange={onChange} />
            </FormField>
            <FormField label="Trạng thái hiển thị" required>
              <select name="KhaDung" value={formData.KhaDung} onChange={onChange}>
                <option value={1}>Đang hiển thị</option>
                <option value={0}>Tạm ẩn</option>
              </select>
            </FormField>
          </aside>

          <div className="admin-movie-details">
            <section className="admin-movie-form-section">
              <div className="admin-movie-section-heading"><span>01</span><h4>Thông tin cơ bản</h4></div>
              <div className="admin-form-grid">
                <FormField label="Tên phim" required className="sm:col-span-2">
                  <input type="text" name="TenPhim" required placeholder="Ví dụ: Dune: Part Two" value={formData.TenPhim} onChange={onChange} />
                </FormField>
                <FormField label="Thời lượng" required helperText="Đơn vị: phút">
                  <input type="number" name="ThoiLuong" required min="1" placeholder="120" value={formData.ThoiLuong} onChange={onChange} />
                </FormField>
                <FormField label="Giới hạn độ tuổi" required>
                  <select name="GioiHanTuoi" value={formData.GioiHanTuoi} onChange={onChange}>
                    {['P', 'C13', 'C16', 'C18'].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
                  </select>
                </FormField>
                <FormField label="Thể loại" required className="sm:col-span-2">
                  <input type="text" name="TheLoai" required placeholder="Hành động, Khoa học viễn tưởng" value={formData.TheLoai} onChange={onChange} />
                </FormField>
              </div>
            </section>

            <section className="admin-movie-form-section">
              <div className="admin-movie-section-heading"><span>02</span><h4>Phát hành & truyền thông</h4></div>
              <div className="admin-form-grid">
                <FormField label="Ngày khởi chiếu" required>
                  <input type="date" name="NgayKhoiChieu" required value={formData.NgayKhoiChieu} onChange={onChange} />
                </FormField>
                <FormField label="Ngày kết thúc chiếu">
                  <input type="date" name="NgayKetThuc" value={formData.NgayKetThuc} onChange={onChange} />
                </FormField>
                <FormField label="Trailer YouTube" required helperText="Chấp nhận URL YouTube hoặc youtu.be." className="sm:col-span-2">
                  <input type="url" name="Trailer" required placeholder="https://youtube.com/watch?v=..." value={formData.Trailer} onChange={onChange} />
                </FormField>
              </div>
            </section>

            <section className="admin-movie-form-section">
              <div className="admin-movie-section-heading"><span>03</span><h4>Đội ngũ sản xuất</h4></div>
              <div className="admin-form-grid">
                <FormField label="Đạo diễn"><input type="text" name="DaoDien" placeholder="Tên đạo diễn" value={formData.DaoDien} onChange={onChange} /></FormField>
                <FormField label="Diễn viên"><input type="text" name="DienVien" placeholder="Các diễn viên, cách nhau bởi dấu phẩy" value={formData.DienVien} onChange={onChange} /></FormField>
              </div>
            </section>

            <section className="admin-movie-form-section">
              <div className="admin-movie-section-heading"><span>04</span><h4>Mô tả nội dung</h4><p>Định dạng vừa đủ để nội dung dễ đọc trên trang chi tiết phim.</p></div>
              <FormField label="Nội dung phim">
                <RichTextEditor name="NoiDung" value={formData.NoiDung} onChange={richTextChange} disabled={isSubmitting} placeholder="Tóm tắt cốt truyện…" />
              </FormField>
            </section>

            {editingMovie && (
              <div className="admin-movie-audit">
                <span>Ngày tạo <strong>{editingMovie.NgayTao || 'Chưa có dữ liệu'}</strong></span>
                <span>Cập nhật gần nhất <strong>{editingMovie.NgayCapNhat || 'Chưa cập nhật'}</strong></span>
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </Modal>
  );
};

export default MovieModal;
