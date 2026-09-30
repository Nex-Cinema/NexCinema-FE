import { useState } from 'react';
import { ExternalLink, Film } from 'lucide-react';
import { sanitizeRichText } from '../../../utils/richText';
import AdminButton from './AdminButton';
import Modal from './Modal';

const hiddenKeys = /^(id|ma[A-Z_]|uuid)/i;
const wideKeys = new Set(['NoiDung', 'DienVien', 'MoTa']);
const labelMap = {
  TenPhim: 'Tên phim',
  ThoiLuong: 'Thời lượng',
  TheLoai: 'Thể loại',
  NgayKhoiChieu: 'Ngày khởi chiếu',
  NgayKetThuc: 'Ngày kết thúc',
  DaoDien: 'Đạo diễn',
  DienVien: 'Diễn viên',
  GioiHanTuoi: 'Giới hạn tuổi',
  NoiDung: 'Nội dung',
  Trailer: 'Trailer',
  KhaDung: 'Trạng thái',
  NgayTao: 'Ngày tạo',
  NgayCapNhat: 'Ngày cập nhật',
};

const formatLabel = (key) => labelMap[key] || key.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ');

const formatValue = (key, value) => {
  if (key === 'ThoiLuong') return `${value} phút`;
  if (/^(Gia|SoTien|DoanhThu)/i.test(key) && Number.isFinite(Number(value))) return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  if (/^Ngay/i.test(key) && /^\d{4}-\d{2}-\d{2}/.test(String(value))) {
    const rawValue = String(value);
    const date = new Date(rawValue);
    return rawValue.length <= 10 ? date.toLocaleDateString('vi-VN') : date.toLocaleString('vi-VN');
  }
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
};

const DetailPoster = ({ src, title }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="admin-detail-poster">
      {src && !failed ? <img src={src} alt={`Poster ${title}`} onError={() => setFailed(true)} /> : <span><Film size={28} strokeWidth={1.5} />Không có poster</span>}
    </div>
  );
};

const DetailValue = ({ name, value }) => {
  if (name === 'KhaDung') return <span className={`admin-detail-status ${Number(value) === 1 ? 'is-active' : ''}`}>{Number(value) === 1 ? 'Khả dụng' : 'Tạm ẩn'}</span>;
  if (name === 'Trailer' && /^https?:\/\//i.test(String(value))) return <a className="admin-detail-link" href={value} target="_blank" rel="noreferrer">Mở trailer <ExternalLink size={13} /></a>;
  if (name === 'NoiDung') return <div className="admin-detail-rich-text" dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />;
  return formatValue(name, value);
};

const AdminDetailDialog = ({ item, title, onClose }) => {
  if (!item) return null;
  const details = Object.entries(item).filter(([key, value]) => key !== 'HinhAnh' && !hiddenKeys.test(key) && value !== '' && value !== null && value !== undefined);

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      description="Thông tin chi tiết"
      size="medium"
      bodyClassName="admin-detail-modal-body"
      footer={<><span className="admin-modal-footer-note">Dữ liệu được đồng bộ từ hệ thống</span><div><AdminButton variant="outline" onClick={onClose}>Đóng</AdminButton></div></>}
    >
      <div className={`admin-detail-layout ${item.HinhAnh ? 'has-poster' : ''}`}>
        {item.HinhAnh && <DetailPoster src={item.HinhAnh} title={title} />}
        <dl className="admin-detail-list">
          {details.map(([key, value]) => (
            <div key={key} data-wide={wideKeys.has(key)}>
              <dt>{formatLabel(key)}</dt>
              <dd><DetailValue name={key} value={value} /></dd>
            </div>
          ))}
        </dl>
      </div>
    </Modal>
  );
};

export default AdminDetailDialog;
