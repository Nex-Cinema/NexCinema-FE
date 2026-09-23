/**
 * showtimeHelper.ts
 *
 * Helper functions for processing showtimes, formatting start/end times,
 * and grouping slots by cinema hall.
 */

export interface FormattedSlot {
  id: string;
  time: string;
  endTime?: string;
  roomName: string;
  formatTag: string;
  seatsLeft: number;
  isHot?: boolean;
  isSoldOut?: boolean;
}

export const formatShowtimeSlot = (rawSlot: any): FormattedSlot => {
  const gioChieuDate = rawSlot.GioChieu ? new Date(rawSlot.GioChieu) : null;
  const timeStr = gioChieuDate
    ? gioChieuDate.toTimeString().substring(0, 5)
    : rawSlot.time || '00:00';

  return {
    id: rawSlot.MaSuatChieu || rawSlot.id || 'st-slot',
    time: timeStr,
    roomName: rawSlot.PhongChieu?.TenPhong || rawSlot.roomName || 'Phòng chiếu',
    formatTag: rawSlot.PhongChieu?.LoaiPhong?.TenLoaiPhong || rawSlot.formatTag || '2D Standard',
    seatsLeft: typeof rawSlot.seatsLeft === 'number' ? rawSlot.seatsLeft : 50,
    isHot: rawSlot.isHot || false,
    isSoldOut: rawSlot.isSoldOut || false,
  };
};
