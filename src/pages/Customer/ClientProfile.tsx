import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  Ticket,
  Bell,
  LogOut,
  ChevronRight,
  Camera,
  CheckCircle,
  Search,
  MapPin,
  Clock,
  Calendar,
  Receipt,
  Lock,
  Phone,
  Save,
  Check,
  X,
  CreditCard,
  AlertTriangle,
  QrCode,
  CheckCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import profileAvatar from '@/assets/profile.png';

interface TicketItem {
  code: string;
  movieTitle: string;
  posterUrl: string;
  date: string;
  time: string;
  room: string;
  seats: string;
  price: string;
  status: 'SUCCESS' | 'CANCELLED';
  format: string;
}

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  message: string;
  read: boolean;
  type: 'TICKET' | 'PAYMENT' | 'REMINDER' | 'FAILED';
}

const INITIAL_TRANSACTIONS: TicketItem[] = [
  {
    code: 'NX260908001',
    movieTitle: 'Quý Tử Vượt Giàu',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCQytFZ4byeLr3YxoPqzxGqou2YONdVhb3UhfIeb6obFW4SHptJ-92EPxM-E5UrRhFkpx2ztQdtrsU7v3dO4BRDdn64sD7YHokgvKPagTB3GW6jiiMJI8dc25uRdPbTA9O9S4uPkxL63ITdkUrJE7A5qmDBor4YXvkc8YfWs7WZk5Tfaz7gGJLLkmuNa1NV3QrpcSAPnv1kXNkWurQGtd54WrpPsgoyq_oqvJvNWaWFFIoh2_dbwHLPww',
    date: '08/09/2026',
    time: '19:30',
    room: 'Phòng 05',
    seats: 'J4, J5',
    price: '100.000 ₫',
    status: 'SUCCESS',
    format: '2D',
  },
  {
    code: 'NX241029045',
    movieTitle: 'Dune: Hành Tinh Cát - Phần 2',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCWPCaP4M4EV_Ts8JP6K8I8h16SCDq7ofN2rWvG384qUyfKHar633mJOCpSvPcApIi1BJ_n9WziH1ThD43s3Cg1ksr5fQVa6xaEJ8eXEAbsD3lbArGODphTSonUmVcAHvsHN3r42fga-fRnbHvoLntrQu_IvM_6SXENNmAf1qZ09hbC-1u-GBzTu6tvDtfRA4ioTIBapJqZT-qFeRLpLRdByCZ8p_YKP3pgRkJNGUbNVYEzrjn4G5oRYw',
    date: '29/10/2024',
    time: '11:30',
    room: 'Phòng IMAX Laser',
    seats: 'J4, J5',
    price: '220.000 ₫',
    status: 'SUCCESS',
    format: 'IMAX',
  },
  {
    code: 'NX240415012',
    movieTitle: 'Godzilla x Kong: Đế Chế Mới',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCOOt3U8QFop5S016xJd4KnGHZ-wZAfFPiP4bgODyLjgATwe72WUG6xhkM7oW0j3Ba0E1hlzuixhdF5_p1LRC1i2gcPzbHZxDepiHWfVWmGPYe-nBxT1FITVhL1vEuWueSW7fE5vmT4JRpE6eIwk_UhGFPo12sYspHBPuL4sNAwBUwCMpY-SZpeya34cl2p5Selj6n-PSHgGcSFW89Gi6yzoZE48Rpj4Bop5S_P1Gc60XH09oL3cODsww',
    date: '15/04/2024',
    time: '20:30',
    room: 'Phòng 02 Standard',
    seats: 'F7',
    price: '50.000 ₫',
    status: 'CANCELLED',
    format: '2D',
  },
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Đặt vé thành công',
    time: '10 phút trước',
    message: "Vé cho phim 'Quý Tử Vượt Giàu' (#NX260908001) đã được xác nhận. Vui lòng kiểm tra mã QR khi tới rạp.",
    read: false,
    type: 'TICKET',
  },
  {
    id: 'notif-2',
    title: 'Thanh toán thành công',
    time: '12 phút trước',
    message: 'Đã thanh toán 100.000 ₫ qua cổng PayOS VietQR cho đơn hàng #NX260908001.',
    read: false,
    type: 'PAYMENT',
  },
  {
    id: 'notif-3',
    title: 'Vé của bạn sắp đến giờ chiếu',
    time: '2 ngày trước',
    message: 'Suất chiếu Dune: Hành Tinh Cát 2 sẽ bắt đầu trong 30 phút nữa tại Phòng IMAX Laser, NexCinema Center.',
    read: true,
    type: 'REMINDER',
  },
  {
    id: 'notif-4',
    title: 'Giao dịch không thành công',
    time: '1 tháng trước',
    message: 'Giao dịch thanh toán đơn hàng #NX240415012 đã hết hạn giữ chỗ do quá thời gian hoàn tất chuyển khoản.',
    read: true,
    type: 'FAILED',
  },
];

export const ClientProfile: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();

  const tabParam = searchParams.get('tab') as 'profile' | 'transactions' | 'notifications' | null;
  const [activeTab, setActiveTab] = useState<'profile' | 'transactions' | 'notifications'>(
    tabParam && ['profile', 'transactions', 'notifications'].includes(tabParam) ? tabParam : 'profile'
  );

  useEffect(() => {
    const currentTab = searchParams.get('tab') as 'profile' | 'transactions' | 'notifications' | null;
    if (currentTab && ['profile', 'transactions', 'notifications'].includes(currentTab)) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  // Form State
  const [fullName, setFullName] = useState(user?.name || 'Hoàng Nam');
  const [phone, setPhone] = useState('0912 345 678');
  const [birthday, setBirthday] = useState('15/08/1998');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');

  // Transaction Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'CANCELLED'>('ALL');
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  // Profile Form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cập nhật thông tin cá nhân thành công!');
  };

  const handleResetProfileForm = () => {
    setFullName(user?.name || 'Hoàng Nam');
    setPhone('0912 345 678');
    setBirthday('15/08/1998');
    setGender('male');
    toast('Đã khôi phục thông tin gốc.', { icon: 'ℹ️' });
  };

  // Filtered Transactions
  const filteredTransactions = INITIAL_TRANSACTIONS.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.movieTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filtered Notifications
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

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
    toast.success('Đã đăng xuất tài khoản!');
    navigate('/login');
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f3f3] text-[#1b1c1c] font-sans pt-4 pb-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e] mb-6">
          <Link to="/" className="hover:text-[#d71920] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#1b1c1c] font-semibold">Tài khoản & Hồ sơ cá nhân</span>
        </div>

        {/* MAIN 2-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: USER SUMMARY SIDEBAR (4 of 12 cols = ~30%) */}
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
              <p className="text-xs text-[#5f5e5e] mt-0.5">{user?.email || 'hoangnam.movie@gmail.com'}</p>

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
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </nav>
          </aside>

          {/* RIGHT COLUMN: TAB CONTENT PANES (8 of 12 cols = ~70%) */}
          <section className="lg:col-span-8 xl:col-span-9 w-full">
            
            {/* ── TAB 1: LỊCH SỬ GIAO DỊCH ────────────────────────────── */}
            {activeTab === 'transactions' && (
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
                    Tất cả ({INITIAL_TRANSACTIONS.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('SUCCESS')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === 'SUCCESS'
                        ? 'bg-[#1b1c1c] text-white font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Thành công ({INITIAL_TRANSACTIONS.filter((t) => t.status === 'SUCCESS').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('CANCELLED')}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                      statusFilter === 'CANCELLED'
                        ? 'bg-[#1b1c1c] text-white font-bold'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    Đã hủy ({INITIAL_TRANSACTIONS.filter((t) => t.status === 'CANCELLED').length})
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
                                  ticket.status === 'CANCELLED'
                                    ? 'line-through text-gray-500'
                                    : 'text-[#1b1c1c]'
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
                            onClick={() => setSelectedTicket(ticket)}
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
            )}

            {/* ── TAB 2: THÔNG TIN CÁ NHÂN ────────────────────────────── */}
            {activeTab === 'profile' && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xs border border-[#e4e2e2] animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-[#1b1c1c]">Thông tin cá nhân</h2>
                  <p className="text-xs text-[#5f5e5e] mt-0.5">
                    Quản lý hồ sơ định danh và thông tin liên hệ nhận vé điện tử của bạn
                  </p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="inputFullName" className="text-xs font-bold text-[#1b1c1c] block">
                        Họ và tên
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="inputFullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
                        />
                        <User className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label htmlFor="inputEmail" className="text-xs font-bold text-[#1b1c1c] block">
                          Địa chỉ Email
                        </label>
                        <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Đã xác thực
                        </span>
                      </div>
                      <div className="relative flex items-center">
                        <input
                          id="inputEmail"
                          type="email"
                          readOnly
                          value={user?.email || 'hoangnam.movie@gmail.com'}
                          className="w-full px-4 py-2.5 bg-[#efeded] text-gray-500 cursor-not-allowed rounded-xl text-sm font-medium focus:outline-none border border-gray-200"
                        />
                        <Lock className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="inputPhone" className="text-xs font-bold text-[#1b1c1c] block">
                        Số điện thoại
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="inputPhone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
                        />
                        <Phone className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Birthday */}
                    <div className="space-y-1.5">
                      <label htmlFor="inputBirthday" className="text-xs font-bold text-[#1b1c1c] block">
                        Ngày sinh
                      </label>
                      <div className="relative flex items-center">
                        <input
                          id="inputBirthday"
                          type="text"
                          placeholder="DD/MM/YYYY"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#f5f3f3] text-[#1b1c1c] rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#d71920]/30 transition-all border border-gray-200"
                        />
                        <Calendar className="w-4 h-4 absolute right-3 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Gender Radio options */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-[#1b1c1c] block">Giới tính</label>
                      <div className="flex items-center gap-4">
                        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === 'male'}
                            onChange={() => setGender('male')}
                            className="accent-[#d71920] w-4 h-4"
                          />
                          <span className="text-xs font-semibold">Nam</span>
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === 'female'}
                            onChange={() => setGender('female')}
                            className="accent-[#d71920] w-4 h-4"
                          />
                          <span className="text-xs font-semibold">Nữ</span>
                        </label>
                        <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] transition-colors">
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={gender === 'other'}
                            onChange={() => setGender('other')}
                            className="accent-[#d71920] w-4 h-4"
                          />
                          <span className="text-xs font-semibold">Khác</span>
                        </label>
                      </div>
                    </div>

                    {/* Password Row */}
                    <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-gray-100">
                      <label className="text-xs font-bold text-[#1b1c1c] block">Mật khẩu tài khoản</label>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-4 bg-[#f5f3f3] rounded-xl gap-3">
                        <div className="flex items-center gap-3">
                          <Lock className="w-5 h-5 text-gray-500" />
                          <div className="text-sm font-bold tracking-widest text-[#1b1c1c]">••••••••••••</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toast.success('Đã gửi liên kết đổi mật khẩu tới email của bạn!')}
                          className="px-4 py-2 rounded-xl bg-white hover:bg-gray-100 text-[#1b1c1c] text-xs font-bold shadow-xs transition-all whitespace-nowrap cursor-pointer border border-gray-200"
                        >
                          Đổi mật khẩu
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleResetProfileForm}
                      className="px-6 py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] text-xs font-bold transition-colors cursor-pointer"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs uppercase tracking-wider shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Cập nhật thông tin</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── TAB 3: THÔNG BÁO ──────────────────────────────────── */}
            {activeTab === 'notifications' && (
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
            )}

          </section>
        </div>
      </div>

      {/* ── MODAL 1: TICKET DETAIL PREVIEW (E-TICKET) ────────────────── */}
      {selectedTicket && (
        <div
          onClick={() => setSelectedTicket(null)}
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
                onClick={() => setSelectedTicket(null)}
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
                    selectedTicket.status === 'SUCCESS'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selectedTicket.status === 'SUCCESS' ? 'Thành công' : 'Đã hủy'}
                </span>
                <h3 className="text-xl font-black text-[#1b1c1c]">{selectedTicket.movieTitle}</h3>
                <p className="text-xs text-gray-500">Rạp NexCinema Lê Duẩn • Tầng 4, TTTM Diamond Plaza</p>
              </div>

              {/* Grid metadata */}
              <div className="grid grid-cols-2 gap-3 bg-[#f5f3f3] p-4 rounded-xl text-center">
                <div>
                  <span className="text-[11px] text-gray-500 block">Ngày chiếu</span>
                  <span className="text-xs font-bold text-[#1b1c1c]">{selectedTicket.date}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Giờ chiếu</span>
                  <span className="text-xs font-bold text-[#d71920]">{selectedTicket.time}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Phòng chiếu</span>
                  <span className="text-xs font-bold text-[#1b1c1c]">{selectedTicket.room}</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Số ghế</span>
                  <span className="text-xs font-bold text-[#1b1c1c]">{selectedTicket.seats}</span>
                </div>
              </div>

              {/* QR Code Stub */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-xs">
                  <QrCode className="w-32 h-32 text-gray-900" />
                </div>
                <span className="font-mono text-sm font-bold tracking-wider text-[#1b1c1c] mt-2">
                  #{selectedTicket.code}
                </span>
                <span className="text-[11px] text-gray-500 mt-0.5">
                  Đưa mã QR này cho nhân viên soát vé tại sảnh rạp
                </span>
              </div>

              {/* Total Price */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-500">Tổng thanh toán:</span>
                <span className="text-lg font-black text-[#d71920]">{selectedTicket.price}</span>
              </div>
            </div>

            {/* Footer button */}
            <div className="p-4 bg-[#f5f3f3] flex items-center justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors shadow-xs cursor-pointer border border-gray-200"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: LOGOUT CONFIRMATION ────────────────────────────── */}
      {isLogoutModalOpen && (
        <div
          onClick={() => setIsLogoutModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in duration-150 border border-gray-200"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#d71920] flex items-center justify-center mb-4 border border-red-100">
              <LogOut className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#1b1c1c]">Đăng xuất tài khoản?</h3>
            <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
              Bạn sẽ cần đăng nhập lại để xem lịch sử vé và thông tin cá nhân của bạn.
            </p>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors cursor-pointer"
              >
                Ở lại
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientProfile;
