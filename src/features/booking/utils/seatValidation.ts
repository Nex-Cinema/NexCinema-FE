import { Seat, SeatType, SeatStatus } from '../types/booking.type';
import {
  PRICE_STANDARD,
  PRICE_VIP,
  PRICE_COUPLE,
  VIP_ROWS,
  COUPLE_ROW,
} from '../constants/bookingConstants';

/**
 * Pure helper to generate full seat map object for rows A-K.
 */
export const generateSeatMap = (
  rows: string[],
  selectedSeatIds: string[],
  soldSeats: string[] = ['C4', 'C5', 'E8', 'F2', 'F3', 'K7', 'K8'],
  heldSeats: string[] = ['D6', 'D7', 'H5']
): Record<string, Seat[]> => {
  const map: Record<string, Seat[]> = {};

  rows.forEach((row) => {
    map[row] = [];
    const isCoupleRow = row === COUPLE_ROW;
    const isVipRow = (VIP_ROWS as readonly string[]).includes(row);
    const price = isCoupleRow ? PRICE_COUPLE : isVipRow ? PRICE_VIP : PRICE_STANDARD;
    const type: SeatType = isCoupleRow ? 'COUPLE' : isVipRow ? 'VIP' : 'STANDARD';

    for (let col = 1; col <= 12; col++) {
      const id = `${row}${col}`;
      const isSold = soldSeats.includes(id);
      const isHeld = heldSeats.includes(id);
      const isSelected = selectedSeatIds.includes(id);

      let status: SeatStatus = 'AVAILABLE';
      if (isSold) status = 'SOLD';
      else if (isHeld) status = 'HELD';
      else if (isSelected) status = 'SELECTED';

      map[row].push({ id, row, col, type, price, status });
    }
  });

  return map;
};

/**
 * Returns number of isolated single AVAILABLE seats for a proposed set of selected IDs.
 * Used for enforcing the single-seat gap rule (ISSUE-13).
 */
export const countIsolatedSeats = (
  seatMap: Record<string, Seat[]>,
  proposedIds: string[],
  rows: string[]
): number => {
  let count = 0;
  const rowLetters = rows.filter((r) => r !== COUPLE_ROW); // Couple row exempt

  for (const row of rowLetters) {
    const rowSeats = (seatMap[row] || []).filter((s) => s.type !== 'COUPLE');
    for (let i = 0; i < rowSeats.length; i++) {
      const s = rowSeats[i];
      const isOccupied =
        s.status === 'SOLD' || s.status === 'HELD' || proposedIds.includes(s.id);

      if (!isOccupied) {
        const leftBlocked =
          i === 0 ||
          rowSeats[i - 1].status === 'SOLD' ||
          rowSeats[i - 1].status === 'HELD' ||
          proposedIds.includes(rowSeats[i - 1].id);
        const rightBlocked =
          i === rowSeats.length - 1 ||
          rowSeats[i + 1].status === 'SOLD' ||
          rowSeats[i + 1].status === 'HELD' ||
          proposedIds.includes(rowSeats[i + 1].id);

        if (leftBlocked && rightBlocked) count++;
      }
    }
  }

  return count;
};

/**
 * Calculates total ticket price for selected seat IDs.
 */
export const calculateTotalAmount = (selectedSeatIds: string[]): number => {
  return selectedSeatIds.reduce((sum, seatId) => {
    const row = seatId.charAt(0);
    const isVipOrCouple = ['G', 'H', 'I', 'K'].includes(row);
    return sum + (isVipOrCouple ? PRICE_VIP : PRICE_STANDARD);
  }, 0);
};
