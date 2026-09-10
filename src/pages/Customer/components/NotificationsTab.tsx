import React, { useState } from 'react';
import { Ticket, Clock, CreditCard, AlertTriangle, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { NotificationItem } from '@/types/user.type';

interface NotificationsTabProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  unreadNotifCount: number;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({
  notifications,
  setNotifications,
  unreadNotifCount,
}) => {
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  const filteredNotifications = notifications.filter((n) => {
    if (notifFilter === 'UNREAD') return !n.read;
    return true;
  });

  const markAllNotifsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
  };

  const toggleNotifRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      {/* Notification Header */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e4e2e2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#1b1c1c]">Thông báo</h2>
            {unreadNotifCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#d71920] text-white">
                {unreadNotifCount} mới
              </span>
            )}
          </div>
          <p className="text-xs text-[#5f5e5e] mt-0.5">
            Cập nhật lịch chiếu, giao dịch mua vé & hướng dẫn vào rạp
          </p>
        </div>
        <button
          onClick={markAllNotifsAsRead}
          className="text-xs font-bold text-[#d71920] hover:text-[#ae0011] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Đánh dấu tất cả đã đọc</span>
        </button>
      </div>

      {/* Notification Filter Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setNotifFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            notifFilter === 'ALL'
              ? 'bg-[#1b1c1c] text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Tất cả ({notifications.length})
        </button>
        <button
          onClick={() => setNotifFilter('UNREAD')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            notifFilter === 'UNREAD'
              ? 'bg-[#1b1c1c] text-white font-bold'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          Chưa đọc ({unreadNotifCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-3">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => toggleNotifRead(notif.id)}
              className={`bg-white p-4 rounded-2xl shadow-xs border border-[#e4e2e2] transition-all flex items-start gap-4 cursor-pointer hover:shadow-md ${
                !notif.read ? 'bg-white' : 'bg-white/80'
              }`}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full mt-3 shrink-0 ${
                  !notif.read ? 'bg-[#d71920]' : 'bg-transparent'
                }`}
              />

              {/* Notification Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  notif.type === 'TICKET'
                    ? 'bg-emerald-100 text-emerald-700'
                    : notif.type === 'PAYMENT'
                    ? 'bg-blue-100 text-blue-700'
                    : notif.type === 'REMINDER'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {notif.type === 'TICKET' && <Ticket className="w-5 h-5" />}
                {notif.type === 'PAYMENT' && <CreditCard className="w-5 h-5" />}
                {notif.type === 'REMINDER' && <Clock className="w-5 h-5" />}
                {notif.type === 'FAILED' && <AlertTriangle className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4
                    className={`text-xs sm:text-sm text-[#1b1c1c] ${
                      !notif.read ? 'font-bold' : 'font-semibold text-gray-700'
                    }`}
                  >
                    {notif.title}
                  </h4>
                  <span className="text-[11px] text-gray-400 shrink-0">{notif.time}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-xs border border-gray-200 text-center text-gray-500 text-xs">
            Không có thông báo nào
          </div>
        )}
      </div>
    </div>
  );
};
