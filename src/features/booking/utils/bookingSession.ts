import { BookingDraft, BookingConfirmationData } from '../types/booking.type';
import { STORAGE_KEYS } from '../constants/bookingConstants';

/**
 * Booking Session Storage Utility
 *
 * Centralizes read, write, and clear operations for transient booking state
 * (booking draft in sessionStorage and booking confirmation in sessionStorage/localStorage).
 */

export const getBookingDraft = (): BookingDraft | null => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEYS.BOOKING_DRAFT);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to parse booking draft from sessionStorage:', error);
    return null;
  }
};

export const saveBookingDraft = (draft: BookingDraft): void => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.BOOKING_DRAFT, JSON.stringify(draft));
  } catch (error) {
    console.error('Failed to save booking draft to sessionStorage:', error);
  }
};

export const clearBookingDraft = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.BOOKING_DRAFT);
  } catch (error) {
    console.error('Failed to clear booking draft from sessionStorage:', error);
  }
};

export const getBookingConfirmation = (): BookingConfirmationData | null => {
  try {
    const saved =
      sessionStorage.getItem(STORAGE_KEYS.BOOKING_CONFIRMATION) ||
      localStorage.getItem(STORAGE_KEYS.BOOKING_CONFIRMATION);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to parse booking confirmation:', error);
    return null;
  }
};

export const saveBookingConfirmation = (data: BookingConfirmationData): void => {
  try {
    const jsonStr = JSON.stringify(data);
    sessionStorage.setItem(STORAGE_KEYS.BOOKING_CONFIRMATION, jsonStr);
    localStorage.setItem(STORAGE_KEYS.BOOKING_CONFIRMATION, jsonStr);
  } catch (error) {
    console.error('Failed to save booking confirmation:', error);
  }
};

export const clearBookingConfirmation = (): void => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.BOOKING_CONFIRMATION);
    localStorage.removeItem(STORAGE_KEYS.BOOKING_CONFIRMATION);
  } catch (error) {
    console.error('Failed to clear booking confirmation:', error);
  }
};
