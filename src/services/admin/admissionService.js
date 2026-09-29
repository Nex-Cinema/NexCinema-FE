import axiosClient from '../../api/axiosClient';

/**
 * Perform QR admission check-in for a booking.
 *
 * @param {string} normalizedPayload - Normalized QR payload (e.g. 'QR_<uuid>')
 * @returns {Promise<{ MaPhieuDat: string, DaCheckIn: boolean, ThoiGianCheckIn: string, SoLuongGhe: number }>}
 */
export const checkInAdmissionQr = async (normalizedPayload) => {
  return await axiosClient.post('/admin/admission/check-in', {
    QRPayload: normalizedPayload,
  });
};
