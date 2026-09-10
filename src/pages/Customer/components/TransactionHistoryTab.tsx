import React, { useState } from 'react';
import { Search, MapPin, Receipt } from 'lucide-react';
import toast from 'react-hot-toast';
import { TicketItem } from '@/types/user.type';

interface TransactionHistoryTabProps {
  transactions: TicketItem[];
  onSelectTicket: (ticket: TicketItem) => void;
}

export const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({
  transactions,
  onSelectTicket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'CANCELLED'>('ALL');

  const filteredTransactions = transactions.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e4e2e2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1b1c1c]">Lịch sử giao dịch</h2>
          <p className="text-xs text-[#5f5e5e] mt-0.5">
            Danh sách các đơn hàng và vé điện tử của bạn tại NexCinema Lê Duẩn
          </p>
        </div>
        {/* Search ticket code */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Tìm mã vé, tên phim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#f5f3f3] text-xs font-medium text-gray-900 placeholder:text-gray-400 rounded-xl focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d71920] transition-all border border-gray-200"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            statusFilter === 'ALL'
              ? 'bg-[#1b1c1c] text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Tất cả ({transactions.length})
        </button>
        <button
          onClick={() => setStatusFilter('SUCCESS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            statusFilter === 'SUCCESS'
              ? 'bg-[#1b1c1c] text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Thành công ({transactions.filter((t) => t.status === 'SUCCESS').length})
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            statusFilter === 'CANCELLED'
              ? 'bg-[#1b1c1c] text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Đã hủy ({transactions.filter((t) => t.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Transactions List */}
      <div className="flex flex-col gap-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((ticket) => (
            <div
              key={ticket.code}
              className={`bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-[#e4e2e2] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                ticket.status === 'CANCELLED' ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Poster Thumb */}
                <div className="w-20 h-28 shrink-0 rounded-xl overflow-hidden relative shadow-xs bg-[#efeded]">
                  <img
                    src={ticket.posterUrl}
                    alt={ticket.movieTitle}
                    className={`w-full h-full object-cover ${
                      ticket.status === 'CANCELLED' ? 'grayscale' : ''
                    }`}
                  />
                  <span className="absolute top-1 left-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    {ticket.format}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`text-base font-bold ${
                        ticket.status === 'CANCELLED' ? 'line-through text-gray-500' : 'text-[#1b1c1c]'
                      }`}
                    >
                      {ticket.movieTitle}
                    </h3>
                    {ticket.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        Thành công
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-gray-200 text-gray-600">
                        Đã hủy
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#d71920]" />
                    <span>NexCinema Lê Duẩn • Q.1, TP.HCM</span>
                  </p>

                  <p className="text-xs text-[#1b1c1c] font-medium">
                    <span className="font-bold text-[#d71920]">{ticket.time}</span> • {ticket.date} • {ticket.room}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs bg-[#f5f3f3] text-[#1b1c1c] px-2 py-0.5 rounded-md font-mono font-semibold">
                      Ghế: {ticket.seats}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{ticket.code}</span>
                  </div>
                </div>
              </div>

              {/* Price & Action Button */}
              <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-100 gap-3">
                <div className="text-left md:text-right">
                  <span className="text-xs text-gray-400 block">Tổng thanh toán</span>
                  <span className="text-base font-extrabold text-[#d71920]">{ticket.price}</span>
                </div>

                <button
                  onClick={() => onSelectTicket(ticket)}
                  className="px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Receipt className="w-4 h-4 text-gray-600" />
                  <span>{ticket.status === 'SUCCESS' ? 'Chi tiết vé' : 'Xem thông tin'}</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-200 text-center text-gray-500 text-xs">
            Không tìm thấy giao dịch nào phù hợp
          </div>
        )}
      </div>

      {/* View More Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => toast('Đã tải tất cả lịch sử giao dịch gần đây', { icon: 'ℹ️' })}
          className="px-6 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-[#1b1c1c] text-xs font-bold shadow-xs transition-colors border border-gray-200 cursor-pointer"
        >
          Xem tất cả giao dịch cũ hơn
        </button>
      </div>
    </div>
  );
};
