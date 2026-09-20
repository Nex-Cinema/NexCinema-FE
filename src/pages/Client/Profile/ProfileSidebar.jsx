import { Ticket, History, RotateCcw, User, LogOut } from 'lucide-react';
import { assets } from '../../../assets/assets';

/**
 * ProfileSidebar — left column navigation panel.
 * Receives all display data and callbacks via props.
 * No API calls, no state.
 */
const ProfileSidebar = ({
  userInfo,
  activeTab,
  onTabChange,
  upcomingCount,
  pastCount,
  refundCount,
  onLogout,
}) => {
  const navItems = [
    {
      key: 'account',
      icon: <User size={18} className="shrink-0" />,
      label: 'Thông tin khách hàng',
    },
    {
      key: 'upcoming',
      icon: <Ticket size={18} className="shrink-0" />,
      label: `Vé Sắp Xem (${upcomingCount})`,
    },
    {
      key: 'past',
      icon: <History size={18} className="shrink-0" />,
      label: `Lịch sử mua hàng (${pastCount})`,
    },
    {
      key: 'refunds',
      icon: <RotateCcw size={18} className="shrink-0" />,
      label: `Yêu cầu hoàn tiền (${refundCount})`,
    },
  ];

  return (
    <aside className="flex w-full shrink-0 flex-col items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm lg:w-[280px]">
      {/* Avatar */}
      <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-red-100 ring-4 ring-red-50">
        <img
          src={assets.profile || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"}
          alt="User Avatar"
          className="w-full h-full object-cover"
        />
      </div>

      {/* User name / username */}
      <div className="text-center w-full mb-2">
        <h2 className="truncate text-xl font-bold tracking-tight text-neutral-950">
          {userInfo.name || 'Đang tải...'}
        </h2>
        <p className="text-[10px] text-gray-500 font-medium mt-0.5">@{userInfo.username}</p>
      </div>

      <div className="my-1 h-px w-full bg-neutral-200" />

      {/* Navigation */}
      <div className="w-full flex flex-col gap-1 text-left">
        {navItems.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === key
                ? 'bg-red-50 text-(--client-primary) font-bold'
                : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
            }`}
          >
            {icon}
            <span className="whitespace-nowrap">{label}</span>
          </button>
        ))}

        <div className="my-2 h-px w-full bg-neutral-200" />

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-all cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          <span className="whitespace-nowrap">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
