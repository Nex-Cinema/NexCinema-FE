/**
 * Định dạng giờ chiếu từ MySQL TIME, ISO string hoặc Date thành HH:mm.
 * Chuỗi TIME của Prisma được đọc trực tiếp để tránh bị lệch theo timezone trình duyệt.
 *
 * @param {string|Date|null|undefined} value - Giá trị giờ chiếu.
 * @returns {string} Giờ dạng HH:mm hoặc --:-- khi không hợp lệ.
 */
export const formatShowtimeTime = (value) => {
  if (!value) return '--:--';

  if (typeof value === 'string') {
    const timeOnlyMatch = value.match(/^(\d{1,2}):(\d{2})/);
    if (timeOnlyMatch) return `${timeOnlyMatch[1].padStart(2, '0')}:${timeOnlyMatch[2]}`;

    const isoTimeMatch = value.match(/T(\d{2}):(\d{2})/);
    if (isoTimeMatch) return `${isoTimeMatch[1]}:${isoTimeMatch[2]}`;
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '--:--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

/**
 * Parse a backend booking/history record and return a Date for the showtime start.
 * Handles both summary records (booking.Phim.NgayChieu/GioChieu) and
 * detail records (booking.ChiTietDatVes[0].SuatChieu.*).
 * Returns null if data is missing or unparseable.
 */
export const getShowtimeStartFromBooking = (booking) => {
  if (!booking) return null;

  let ngayChieu = null;
  let gioChieu = null;

  if (booking.Phim) {
    ngayChieu = booking.Phim.NgayChieu;
    gioChieu = booking.Phim.GioChieu;
  } else if (booking.ChiTietDatVes && booking.ChiTietDatVes.length > 0) {
    const suatChieu = booking.ChiTietDatVes[0]?.SuatChieu;
    if (suatChieu) {
      ngayChieu = suatChieu.NgayChieu;
      gioChieu = suatChieu.GioChieu;
    }
  }

  if (!ngayChieu || !gioChieu) return null;

  try {
    const dDate = new Date(ngayChieu);
    if (isNaN(dDate.getTime())) return null;

    let hour = 0;
    let minute = 0;
    let second = 0;

    // Handle GioChieu parsing (support ISO strings or TIME strings like "HH:mm:ss")
    if (typeof gioChieu === 'string') {
      if (gioChieu.includes('T')) {
        const dTime = new Date(gioChieu);
        if (!isNaN(dTime.getTime())) {
          hour = dTime.getUTCHours();
          minute = dTime.getUTCMinutes();
          second = dTime.getUTCSeconds();
        }
      } else {
        const parts = gioChieu.split(':');
        hour = parseInt(parts[0], 10) || 0;
        minute = parseInt(parts[1], 10) || 0;
        second = parseInt(parts[2], 10) || 0;
      }
    } else {
      const dTime = new Date(gioChieu);
      if (!isNaN(dTime.getTime())) {
        hour = dTime.getUTCHours();
        minute = dTime.getUTCMinutes();
        second = dTime.getUTCSeconds();
      }
    }

    const showtimeStart = new Date(dDate);
    showtimeStart.setUTCHours(hour, minute, second, 0);
    return showtimeStart;
  } catch (e) {
    console.error("Lỗi khi parse showtime:", e);
    return null;
  }
};
