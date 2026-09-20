import SeatSelection from '../SeatSelection';
import Payment from '../Payment';
import TicketConfirmation from '../TicketConfirmation';
import { formatTime } from './ShowtimeSelector';
import BookingStepper from '../../../components/Client/BookingStepper';

/**
 * BookingFlow
 *
 * Switches between the three booking screens:
 *   1. SeatSelection  (isBookingStage)
 *   2. Payment        (isPaymentStage)
 *   3. TicketConfirmation (isTicketStage)
 *
 * The container (index.jsx) owns all state.
 * This component is a pure switcher / orchestrator — no local state.
 *
 * Props:
 *  stage              – 'seat' | 'payment' | 'ticket'
 *  movie              – merged movie object
 *  selectedDateId     – active date string
 *  availableSlots     – showtime slots for the selected date
 *  selectedSlotIndex  – index of selected slot
 *  setSelectedSlotIndex – setter
 *  currentSlot        – availableSlots[selectedSlotIndex]
 *  confirmedSeats     – seats confirmed after hold
 *  confirmedTotalPrice– total price
 *  heldSeatIds        – IDs from POST /dat-ve/giu-ghe
 *  timeLeft           – seconds remaining on hold timer
 *  shouldReloadSeatMap– opaque trigger value for SeatSelection
 *  bookingResult      – result from getBookingDetail or simulatedCheckout
 *  maSuatChieu        – string (from ref, passed directly)
 *  onBackFromSeats    – () => void
 *  onBackFromPayment  – async () => void
 *  onConfirmBooking   – (seats, totalPrice, heldIds, maSuatChieu) => void
 *  onPaymentSuccess   – (bookingDetail, checkoutRes) => void
 *  onHome             – () => void (from TicketConfirmation)
 */
const BookingFlow = ({
  stage,
  movie,
  selectedDateId,
  availableSlots,
  selectedSlotIndex,
  setSelectedSlotIndex,
  currentSlot,
  confirmedSeats,
  confirmedTotalPrice,
  heldSeatIds,
  timeLeft,
  shouldReloadSeatMap,
  bookingResult,
  maSuatChieu,
  onBackFromSeats,
  onBackFromPayment,
  onConfirmBooking,
  onPaymentSuccess,
  onHome,
}) => {
  if (stage === 'ticket') {
    return (
      <TicketConfirmation
        movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={confirmedSeats}
        formatTime={formatTime}
        bookingResult={bookingResult}
        onHome={onHome}
      />
    );
  }

  if (stage === 'payment') {
    return (
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <BookingStepper current={3} />
        <Payment movie={movie}
        selectedDateId={selectedDateId}
        currentSlot={currentSlot}
        selectedSeats={confirmedSeats}
        amount={confirmedTotalPrice}
        formatTime={formatTime}
        timeLeft={timeLeft}
        maSuatChieu={maSuatChieu}
        heldSeatIds={heldSeatIds}
        onBack={onBackFromPayment}
        onPaymentSuccess={onPaymentSuccess}
        />
      </div>
    );
  }

  // stage === 'seat'
  return (
    <div className="mx-auto flex h-[calc(100dvh-5rem)] max-w-[1440px] flex-col overflow-hidden px-4 py-4 sm:px-6 lg:px-8">
      <BookingStepper current={2} compact />
      <SeatSelection
        availableSlots={availableSlots}
        selectedSlotIndex={selectedSlotIndex}
        setSelectedSlotIndex={setSelectedSlotIndex}
        formatTime={formatTime}
        onBack={onBackFromSeats}
        onConfirmBooking={onConfirmBooking}
        shouldReloadSeatMap={shouldReloadSeatMap}
      />
    </div>
  );
};

export default BookingFlow;
