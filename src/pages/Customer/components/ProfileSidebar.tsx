import React from 'react';
import { User, Ticket, Bell, LogOut, ChevronRight, Camera, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import profileAvatar from '@/assets/profile.png';

interface ProfileSidebarProps {
  fullName: string;
  email?: string;
  activeTab: 'profile' | 'transactions' | 'notifications';
  setActiveTab: (tab: 'profile' | 'transactions' | 'notifications') => void;
  unreadNotifCount: number;
  onOpenLogoutModal: () => void;
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  fullName,
  email,
  activeTab,
  setActiveTab,
  unreadNotifCount,
  onOpenLogoutModal,
}) => {
  return (
    <aside className="lg:col-span-4 xl:col-span-3 w-full flex flex-col gap-6">
      {/* User Profile Card */}
      <div className="bg-white p-6 rounded-2xl shadow-xs border border-[#e4e2e2] flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={profileAvatar}
            alt={fullName}
            className="w-24 h-24 rounded-full object-cover shadow-sm ring-4 ring-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';
            }}
          />
          <button
            onClick={() => toast.success('Chọn ảnh đại diện mới từ máy tính')}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#d71920] hover:bg-[#ae0011] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all cursor-pointer"
            title="Thay đổi ảnh đại diện"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <h1 className="text-xl font-bold text-[#1b1c1c]">{fullName}</h1>
        <p className="text-xs text-[#5f5e5e] mt-0.5">{email || 'hoangnam.movie@gmail.com'}</p>

        {/* Verified Badge */}
        <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <CheckCircle className="w-4 h-4 fill-emerald-600 text-white" />
          <span>Tài khoản đã xác thực</span>
        </div>

        {/* Quick Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mt-6 pt-4 border-t border-gray-100 text-left">
          <div className="bg-[#f5f3f3] p-3 rounded-xl">
            <span className="text-[11px] text-[#5f5e5e] block font-medium">Tổng vé mua</span>
            <span className="text-sm font-bold text-[#1b1c1c]">5 vé</span>
          </div>
          <div className="bg-[#f5f3f3] p-3 rounded-xl">
            <span className="text-[11px] text-[#5f5e5e] block font-medium">Năm tham gia</span>
            <span className="text-sm font-bold text-[#1b1c1c]">2024</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu Card */}
      <nav className="bg-white p-2 rounded-2xl shadow-xs border border-[#e4e2e2] flex flex-col gap-1">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'transactions'
              ? 'bg-[#d71920] text-white shadow-xs font-bold'
              : 'text-gray-700 hover:bg-[#f5f3f3] hover:text-black'
          }`}
        >
          <div className="flex items-center gap-3">
            <Ticket className="w-5 h-5" />
            <span>Lịch sử giao dịch</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#d71920] text-white shadow-xs font-bold'
              : 'text-gray-700 hover:bg-[#f5f3f3] hover:text-black'
          }`}
        >
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <span>Thông tin cá nhân</span>
          </div>
          <ChevronRight className="w-4 h-4 opacity-70" />
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'notifications'
              ? 'bg-[#d71920] text-white shadow-xs font-bold'
              : 'text-gray-700 hover:bg-[#f5f3f3] hover:text-black'
          }`}
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5" />
            <span>Thông báo</span>
          </div>
          {unreadNotifCount > 0 && (
            <span
              className={`px-2 py-0.5 text-[11px] font-extrabold rounded-full ${
                activeTab === 'notifications'
                  ? 'bg-white text-[#d71920]'
                  : 'bg-[#d71920] text-white'
              }`}
            >
              {unreadNotifCount}
            </span>
          )}
        </button>

        <div className="my-1 border-t border-gray-100"></div>

        <button
          onClick={onOpenLogoutModal}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </aside>
  );
};
