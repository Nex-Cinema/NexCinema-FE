import { Edit2, Eye, LayoutGrid, Trash2 } from 'lucide-react';
import AdminTable from '../Common/AdminTable';
import { AdminMovieCell } from '../Common/AdminEntityCell';
import StatusBadge from '../Common/StatusBadge';

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
}).format(price);

const ShowtimeTable = ({ showtimes, onEdit, onDelete, onViewSeatMap }) => {
  const columns = [
    {
      header: 'Phim',
      render: (showtime) => (
        <AdminMovieCell
          image={showtime.HinhAnh}
          title={showtime.TenPhim}
          subtitle={`${showtime.ThoiLuong} phút`}
        />
      ),
    },
    { header: 'Phòng', render: (showtime) => <strong className="text-sm font-semibold">{showtime.TenPhong}</strong> },
    {
      header: 'Thời gian',
      render: (showtime) => (
        <span className="admin-table-stack">
          <strong>{showtime.GioChieu.substring(0, 5)} – {showtime.GioKetThuc.substring(0, 5)}</strong>
          <small>{showtime.NgayChieu}</small>
        </span>
      ),
    },
    { header: 'Vé cơ bản', render: (showtime) => <strong className="text-sm font-semibold">{formatPrice(showtime.GiaVeCoBan)}</strong> },
    { header: 'Loại ngày', render: (showtime) => <span className="admin-code">{showtime.TenLoaiNgay}</span> },
    {
      header: 'Ghế đặt',
      render: (showtime) => (
        <button
          type="button"
          onClick={() => onViewSeatMap(showtime)}
          className="admin-seat-count"
          aria-label={`Xem ghế đã đặt của ${showtime.TenPhim}`}
        >
          <Eye size={14} aria-hidden="true" />
          <span>{showtime.DaDat} / {showtime.TongSoGhe}</span>
        </button>
      ),
    },
    { header: 'Trạng thái', render: (showtime) => <StatusBadge status={showtime.KhaDung} /> },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (showtime) => (
        <div className="flex justify-end gap-1">
          <button type="button" onClick={() => onViewSeatMap(showtime)} className="admin-table-action" title="Xem sơ đồ ghế" aria-label={`Xem sơ đồ ghế ${showtime.TenPhim}`}>
            <LayoutGrid size={16} />
          </button>
          <button type="button" onClick={() => onEdit(showtime)} className="admin-table-action" title="Sửa" aria-label={`Sửa suất chiếu ${showtime.TenPhim}`}>
            <Edit2 size={16} />
          </button>
          <button type="button" onClick={() => onDelete(showtime)} className="admin-table-action admin-table-action--danger" title="Xóa" aria-label={`Xóa suất chiếu ${showtime.TenPhim}`}>
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={showtimes} rowKey="MaSuatChieu" showDetailAction={false} />;
};

export default ShowtimeTable;
