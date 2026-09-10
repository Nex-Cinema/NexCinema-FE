import React from 'react';
import { Ticket, X, QrCode } from 'lucide-react';
import { TicketItem } from '@/types/user.type';

interface ETicketModalProps {
  ticket: TicketItem | null;
  onClose: () => void;
}

export const ETicketModal: React.FC<ETicketModalProps> = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-150 border border-gray-200"
      >
        {/* Modal Header */}
        <div className="bg-[#d71920] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            <span className="font-bold text-sm">Vé Điện Tử NexCinema</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-black/20 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-4 text-left">
          <div>
            <span
              className={`inline-block px-2 py-0.5 text-xs font-bold rounded mb-1 ${
                ticket.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {ticket.status === 'SUCCESS' ? 'Thành công' : 'Đã hủy'}
            </span>
            <h3 className="text-xl font-black text-[#1b1c1c]">{ticket.movieTitle}</h3>
            <p className="text-xs text-gray-500">Rạp NexCinema Lê Duẩn • Tầng 4, TTTM Diamond Plaza</p>
          </div>

          {/* Grid metadata */}
          <div className="grid grid-cols-2 gap-3 bg-[#f5f3f3] p-4 rounded-xl text-center">
            <div>
              <span className="text-[11px] text-gray-500 block">Ngày chiếu</span>
              <span className="text-xs font-bold text-[#1b1c1c]">{ticket.date}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Giờ chiếu</span>
              <span className="text-xs font-bold text-[#d71920]">{ticket.time}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Phòng chiếu</span>
              <span className="text-xs font-bold text-[#1b1c1c]">{ticket.room}</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Số ghế</span>
              <span className="text-xs font-bold text-[#1b1c1c]">{ticket.seats}</span>
            </div>
          </div>

          {/* QR Code Stub */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
            <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-xs">
              <QrCode className="w-32 h-32 text-gray-900" />
            </div>
            <span className="font-mono text-sm font-bold tracking-wider text-[#1b1c1c] mt-2">
              #{ticket.code}
            </span>
            <span className="text-[11px] text-gray-500 mt-0.5">
              Đưa mã QR này cho nhân viên soát vé tại sảnh rạp
            </span>
          </div>

          {/* Total Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500">Tổng thanh toán:</span>
            <span className="text-lg font-black text-[#d71920]">{ticket.price}</span>
          </div>
        </div>

        {/* Footer button */}
        <div className="p-4 bg-[#f5f3f3] flex items-center justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors shadow-xs cursor-pointer border border-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
