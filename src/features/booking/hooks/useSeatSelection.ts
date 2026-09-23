import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Seat } from '../types/booking.type';
import { SEAT_ROWS, MAX_SEATS_PER_BOOKING } from '../constants/bookingConstants';
import { generateSeatMap, countIsolatedSeats, calculateTotalAmount } from '../utils/seatValidation';

export interface UseSeatSelectionOptions {
  soldSeats?: string[];
  heldSeats?: string[];
}

export const useSeatSelection = (options: UseSeatSelectionOptions = {}) => {
  const {
    soldSeats = ['C4', 'C5', 'E8', 'F2', 'F3', 'K7', 'K8'],
    heldSeats = ['D6', 'D7', 'H5'],
  } = options;

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const rows = [...SEAT_ROWS];

  const seatMap = generateSeatMap(rows, selectedSeatIds, soldSeats, heldSeats);

  const checkIsolated = useCallback(
    (proposedIds: string[]) => countIsolatedSeats(seatMap, proposedIds, rows),
    [seatMap, rows]
  );

  const handleToggleSeat = (seat: Seat) => {
    if (seat.status === 'SOLD' || seat.status === 'HELD') return;

    if (seat.type === 'COUPLE') {
      const colNum = seat.col;
      const partnerCol = colNum % 2 === 1 ? colNum + 1 : colNum - 1;
      const id1 = `${seat.row}${Math.min(colNum, partnerCol)}`;
      const id2 = `${seat.row}${Math.max(colNum, partnerCol)}`;

      const isPairSelected = selectedSeatIds.includes(id1) && selectedSeatIds.includes(id2);

      if (isPairSelected) {
        setSelectedSeatIds((prev) => prev.filter((id) => id !== id1 && id !== id2));
      } else {
        if (selectedSeatIds.length + 2 > MAX_SEATS_PER_BOOKING) {
          toast.error(`Tối đa chỉ được chọn ${MAX_SEATS_PER_BOOKING} ghế trong một lần đặt vé!`);
          return;
        }
        setSelectedSeatIds((prev) => Array.from(new Set([...prev, id1, id2])));
      }
    } else {
      const currentIsolated = checkIsolated(selectedSeatIds);

      if (selectedSeatIds.includes(seat.id)) {
        const afterRemoval = selectedSeatIds.filter((id) => id !== seat.id);
        if (checkIsolated(afterRemoval) > currentIsolated) {
          toast.error('Không thể bỏ chọn ghế này vì sẽ tạo ra 1 ghế trống đơn lẻ!');
          return;
        }
        setSelectedSeatIds(afterRemoval);
      } else {
        if (selectedSeatIds.length >= MAX_SEATS_PER_BOOKING) {
          toast.error(`Tối đa chỉ được chọn ${MAX_SEATS_PER_BOOKING} ghế trong một lần đặt vé!`);
          return;
        }
        const proposed = [...selectedSeatIds, seat.id];
        if (checkIsolated(proposed) > currentIsolated) {
          toast.error(
            'Không thể chọn ghế này vì sẽ để trống 1 ghế đơn lẻ giữa các ghế đã chọn/đã bán. Vui lòng chọn ghế liền kề!',
            { duration: 4000 }
          );
          return;
        }
        setSelectedSeatIds((prev) => [...prev, seat.id]);
      }
    }
  };

  const clearSelectedSeats = () => setSelectedSeatIds([]);

  const totalAmount = calculateTotalAmount(selectedSeatIds);

  return {
    selectedSeatIds,
    setSelectedSeatIds,
    selectedSeatCount: selectedSeatIds.length,
    totalAmount,
    seatMap,
    rows,
    handleToggleSeat,
    clearSelectedSeats,
  };
};

export default useSeatSelection;
