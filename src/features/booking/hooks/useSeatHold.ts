import { useState, useEffect, useRef } from 'react';
import { cancelHeldSeats } from '@/apis/bookingApi';
import { SEAT_HOLD_DURATION_S } from '../constants/bookingConstants';

/**
 * useSeatHold
 *
 * Domain hook managing the 10-minute countdown after seats are held.
 * Automatically cancels held seats when timer hits zero or on unmount cleanup.
 */
export const useSeatHold = (onExpire?: () => void) => {
  const [heldSeatIds, setHeldSeatIds] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(SEAT_HOLD_DURATION_S);

  const hasActiveHoldRef = useRef(false);
  const heldSeatIdsRef = useRef<string[]>([]);
  const maSuatChieuRef = useRef('');
  const isPaymentSuccessRef = useRef(false);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    heldSeatIdsRef.current = heldSeatIds;
  }, [heldSeatIds]);

  useEffect(() => {
    return () => {
      if (
        hasActiveHoldRef.current &&
        !isPaymentSuccessRef.current &&
        heldSeatIdsRef.current.length > 0 &&
        maSuatChieuRef.current
      ) {
        cancelHeldSeats(maSuatChieuRef.current, heldSeatIdsRef.current).catch((err) =>
          console.error('Unmount cleanup: Failed to release held seats:', err)
        );
      }
    };
  }, []);

  useEffect(() => {
    if (heldSeatIds.length === 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          onExpireRef.current?.();
          return SEAT_HOLD_DURATION_S;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [heldSeatIds]);

  const activateHold = (seatIds: string[], maSuatChieu: string) => {
    heldSeatIdsRef.current = seatIds;
    maSuatChieuRef.current = maSuatChieu;
    hasActiveHoldRef.current = true;
    isPaymentSuccessRef.current = false;
    setHeldSeatIds(seatIds);
    setTimeLeft(SEAT_HOLD_DURATION_S);
  };

  const markPaymentSuccess = () => {
    isPaymentSuccessRef.current = true;
    hasActiveHoldRef.current = false;
    setHeldSeatIds([]);
    setTimeLeft(SEAT_HOLD_DURATION_S);
  };

  const releaseHold = async () => {
    const seatIds = heldSeatIdsRef.current;
    const maSuatChieu = maSuatChieuRef.current;
    hasActiveHoldRef.current = false;
    setHeldSeatIds([]);
    setTimeLeft(SEAT_HOLD_DURATION_S);
    if (seatIds.length > 0 && maSuatChieu) {
      try {
        await cancelHeldSeats(maSuatChieu, seatIds);
      } catch (err) {
        console.error('Failed to release held seats:', err);
      }
    }
  };

  return {
    heldSeatIds,
    timeLeft,
    hasActiveHoldRef,
    maSuatChieuRef,
    isPaymentSuccessRef,
    activateHold,
    markPaymentSuccess,
    releaseHold,
  };
};

export default useSeatHold;
