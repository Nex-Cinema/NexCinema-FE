/**
 * statusHelper.ts
 *
 * Helper functions for formatting booking, seat, and transaction statuses
 * into user-friendly Vietnamese text and Tailwind badge CSS classes.
 */

export const getSeatStatusInfo = (status: string) => {
  switch (status) {
    case 'AVAILABLE':
      return { label: 'Ghế trống', colorClass: 'bg-[#f1f5f9] text-slate-700 border-slate-300' };
    case 'SELECTED':
      return { label: 'Đang chọn', colorClass: 'bg-[#d71920] text-white' };
    case 'HELD':
      return { label: 'Đang được giữ', colorClass: 'bg-orange-100 text-orange-500 border-orange-300' };
    case 'SOLD':
      return { label: 'Đã bán', colorClass: 'bg-[#e2e8f0] text-slate-400 border-slate-300' };
    default:
      return { label: 'Không khả dụng', colorClass: 'bg-gray-100 text-gray-500' };
  }
};

export const getBookingStatusInfo = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { label: 'Chờ thanh toán', badgeClass: 'bg-amber-100 text-amber-800 border-amber-300' };
    case 'SUCCESS':
    case 'PAID':
    case 'COMPLETED':
      return { label: 'Thành công', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    case 'FAILED':
      return { label: 'Thất bại', badgeClass: 'bg-rose-100 text-rose-800 border-rose-300' };
    case 'CANCELLED':
      return { label: 'Đã hủy', badgeClass: 'bg-gray-100 text-gray-700 border-gray-300' };
    case 'EXPIRED':
      return { label: 'Hết hạn', badgeClass: 'bg-orange-100 text-orange-800 border-orange-300' };
    default:
      return { label: status, badgeClass: 'bg-gray-100 text-gray-800' };
  }
};
