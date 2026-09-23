import { useState, useMemo } from 'react';

const DAYS_OF_WEEK = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * useMovieShowtimes
 *
 * Groups raw showtime array into date-keyed buckets and derives the
 * available date list + current slot list based on selected date.
 *
 * @param showtimes – raw API showtimes array
 */
const useMovieShowtimes = (showtimes: any[]) => {
  const [selectedDateIdState, setSelectedDateId] = useState('');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  const groupedShowtimes = useMemo(() => {
    const groups: Record<string, any[]> = {};
    if (Array.isArray(showtimes)) {
      showtimes.forEach((st) => {
        const d = new Date(st.NgayChieu);
        const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
        if (!groups[dateStr]) groups[dateStr] = [];
        groups[dateStr].push(st);
      });
    }
    return groups;
  }, [showtimes]);

  const realDates = useMemo(() => {
    return Object.keys(groupedShowtimes)
      .sort()
      .map((dateStr) => {
        const dateObj = new Date(dateStr);
        return {
          id: dateStr,
          dayName: DAYS_OF_WEEK[dateObj.getDay()],
          dateNum: dateObj.getDate(),
        };
      });
  }, [groupedShowtimes]);

  const selectedDateId = useMemo(() => {
    if (selectedDateIdState && realDates.some((rd) => rd.id === selectedDateIdState)) {
      return selectedDateIdState;
    }
    return realDates[0]?.id || '';
  }, [realDates, selectedDateIdState]);

  const availableSlots = useMemo(() => {
    const rawSlots = groupedShowtimes[selectedDateId] || [];
    return rawSlots.map((st) => ({ ...st, time: st.GioChieu, showId: st.MaSuatChieu }));
  }, [groupedShowtimes, selectedDateId]);

  const handleSelectDate = (dateId: string) => {
    setSelectedDateId(dateId);
    setSelectedSlotIndex(0);
  };

  return {
    realDates,
    selectedDateId,
    availableSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    handleSelectDate,
    hasShowtimes: showtimes.length > 0,
  };
};

export default useMovieShowtimes;
