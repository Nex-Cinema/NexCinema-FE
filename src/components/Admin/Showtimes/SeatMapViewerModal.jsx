import { CalendarDays, Clock3, DoorOpen, Film } from 'lucide-react';
import { CinemaSeat, SeatLegend } from '../../Seats/SeatVisuals';
import AdminButton from '../Common/AdminButton';
import Modal from '../Common/Modal';

const getSeatState = (seat) => {
  if (seat.KhaDung === 0) return 'locked';
  if (seat.TrangThai === 1) return 'sold';
  if (seat.TrangThai === 2) return 'held';
  return 'available';
};

const shortTime = (value = '') => value.substring(0, 5) || '--:--';

const formatDate = (value) => {
  if (!value) return 'Chưa cập nhật';
  const [year, month, day] = value.substring(0, 10).split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
};

const EmptySeatMap = () => (
  <div className="admin-showtime-seat-empty">
    <span><Film size={24} strokeWidth={1.5} /></span>
    <strong>Chưa có sơ đồ ghế</strong>
    <p>Suất chiếu này chưa được đồng bộ ghế từ phòng chiếu.</p>
  </div>
);

const SeatsGrid = ({ seats }) => {
  if (!Array.isArray(seats) || seats.length === 0) return <EmptySeatMap />;

  const rowsMap = {};
  seats.forEach((seat) => {
    if (!seat?.MaGhe) return;
    const coordinate = seat.MaGhe.split('-').at(-1) || 'A1';
    const row = coordinate.match(/[A-Za-z]+/)?.[0]?.toUpperCase() || 'A';
    const column = Number(coordinate.match(/\d+/)?.[0] || 1);
    if (!rowsMap[row]) rowsMap[row] = [];
    rowsMap[row].push({ ...seat, column, label: coordinate });
  });

  const rowKeys = Object.keys(rowsMap).sort();
  if (rowKeys.length === 0) return <EmptySeatMap />;
  rowKeys.forEach((row) => rowsMap[row].sort((a, b) => a.column - b.column));

  return (
    <div className="admin-showtime-seat-map">
      <div className="admin-showtime-screen"><span>Màn hình</span></div>
      <div className="admin-showtime-seat-grid">
        {rowKeys.map((rowName) => (
          <div key={rowName} className="admin-showtime-seat-row">
            <span>{rowName}</span>
            <div>
              {rowsMap[rowName].map((seat) => (
                <CinemaSeat
                  key={seat.MaGheSuatChieu || seat.MaGhe}
                  label={seat.label}
                  typeName={seat.TenLoaiGhe}
                  state={getSeatState(seat)}
                  compact
                  disabled
                />
              ))}
            </div>
            <span>{rowName}</span>
          </div>
        ))}
      </div>
      <SeatLegend
        className="admin-showtime-legend"
        items={[
          { label: 'Còn trống', typeName: 'Thường' },
          { label: 'Ghế VIP', typeName: 'VIP' },
          { label: 'Đang giữ', typeName: 'Thường', state: 'held' },
          { label: 'Đã bán', typeName: 'Thường', state: 'sold' },
          { label: 'Bị khóa', typeName: 'Thường', state: 'locked' },
        ]}
      />
    </div>
  );
};

const SeatMapViewerModal = ({ selectedShowtimeSeats, onClose }) => {
  const showtime = selectedShowtimeSeats?.showtime;
  const seats = selectedShowtimeSeats?.seats || [];
  const seatStats = seats.reduce((stats, seat) => {
    const state = getSeatState(seat);
    stats[state] = (stats[state] || 0) + 1;
    return stats;
  }, {});

  return (
    <Modal
      isOpen={Boolean(selectedShowtimeSeats)}
      onClose={onClose}
      title="Sơ đồ ghế suất chiếu"
      description={showtime ? `${showtime.TenPhim} · ${showtime.TenPhong}` : ''}
      size="wide"
      bodyClassName="admin-seat-viewer-body"
      footer={<><span className="admin-modal-footer-note">{seats.length} ghế · {seatStats.sold || 0} đã bán · {seatStats.held || 0} đang giữ</span><div><AdminButton variant="outline" onClick={onClose}>Đóng sơ đồ</AdminButton></div></>}
    >
      {showtime && (
        <div className="admin-seat-viewer">
          <div className="admin-showtime-summary">
            <div><span><Film size={17} strokeWidth={1.6} /></span><small>Phim</small><strong>{showtime.TenPhim || 'Chưa cập nhật'}</strong></div>
            <div><span><DoorOpen size={17} strokeWidth={1.6} /></span><small>Phòng chiếu</small><strong>{showtime.TenPhong || 'Chưa cập nhật'}</strong></div>
            <div><span><CalendarDays size={17} strokeWidth={1.6} /></span><small>Ngày chiếu</small><strong>{formatDate(showtime.NgayChieu)}</strong></div>
            <div><span><Clock3 size={17} strokeWidth={1.6} /></span><small>Khung giờ</small><strong>{shortTime(showtime.GioChieu)} – {shortTime(showtime.GioKetThuc)}</strong></div>
          </div>
          <SeatsGrid seats={seats} />
        </div>
      )}
    </Modal>
  );
};

export default SeatMapViewerModal;
