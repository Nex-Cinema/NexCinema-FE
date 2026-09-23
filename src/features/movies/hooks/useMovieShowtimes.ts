import { useState, useMemo } from 'react';

/**
 * useMovieShowtimes
 *
 * Groups showtimes by date & cinema hall, handling date tab selection.
 *
 * @param showtimes – raw showtimes array from API
 */
export const useMovieShowtimes = (showtimes: any[]) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const availableDates = useMemo(() => {
    if (!showtimes || showtimes.length === 0) return [];
    const datesSet = new Set<string>();
    showtimes.forEach((sc) => {
      if (sc.NgayChieu) {
        const dStr = new Date(sc.NgayChieu).toISOString().substring(0, 10);
        datesSet.add(dStr);
      }
    });
    const sorted = Array.from(datesSet).sort();
    return sorted;
  }, [showtimes]);

  const activeDate = useMemo(() => {
    if (selectedDate && availableDates.includes(selectedDate)) {
      return selectedDate;
    }
    return availableDates[0] || '';
  }, [selectedDate, availableDates]);

  const filteredShowtimes = useMemo(() => {
    if (!activeDate || !showtimes) return [];
    return showtimes.filter((sc) => {
      const dStr = new Date(sc.NgayChieu).toISOString().substring(0, 10);
      return dStr === activeDate;
    });
  }, [activeDate, showtimes]);

  const groupedByRoom = useMemo(() => {
    const groups: Record<string, { roomName: string; roomType: string; slots: any[] }> = {};

    filteredShowtimes.forEach((sc) => {
      const roomId = sc.MaPhong || sc.PhongChieu?.MaPhong || 'default';
      const roomName = sc.PhongChieu?.TenPhong || sc.TenPhong || 'Phòng chiếu';
      const roomType = sc.PhongChieu?.LoaiPhong?.TenLoaiPhong || sc.LoaiPhong || 'Standard';

      if (!groups[roomId]) {
        groups[roomId] = { roomName, roomType, slots: [] };
      }
      groups[roomId].slots.push(sc);
    });

    return Object.values(groups);
  }, [filteredShowtimes]);

  return {
    availableDates,
    activeDate,
    setSelectedDate,
    filteredShowtimes,
    groupedByRoom,
  };
};

export default useMovieShowtimes;
