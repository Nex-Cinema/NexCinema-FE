import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { TicketItem, NotificationItem } from '@/types/user.type';

import { ProfileSidebar } from './components/ProfileSidebar';
import { TransactionHistoryTab } from './components/TransactionHistoryTab';
import { PersonalInfoTab } from './components/PersonalInfoTab';
import { NotificationsTab } from './components/NotificationsTab';
import { ETicketModal } from './components/ETicketModal';
import { LogoutModal } from './components/LogoutModal';

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

  // Selected ticket for Modal
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Logout Modal State
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleResetProfileForm = () => {
    setFullName(user?.name || 'Hoàng Nam');
    setPhone('0912 345 678');
    setBirthday('15/08/1998');
    setGender('male');
    toast('Đã khôi phục thông tin gốc.', { icon: 'ℹ️' });
  };

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    logout();
    toast.success('Đã đăng xuất tài khoản!');
    navigate(ROUTES.AUTH.LOGIN);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f3f3] text-[#1b1c1c] font-sans pt-4 pb-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-[#5f5e5e] mb-6">
          <Link to={ROUTES.HOME} className="hover:text-[#d71920] transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-[#1b1c1c] font-semibold">Tài khoản & Hồ sơ cá nhân</span>
        </div>

        {/* MAIN 2-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: SIDEBAR */}
          <ProfileSidebar
            fullName={fullName}
            email={user?.email}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            unreadNotifCount={unreadNotifCount}
            onOpenLogoutModal={() => setIsLogoutModalOpen(true)}
          />

          {/* RIGHT COLUMN: TAB CONTENT PANES */}
          <section className="lg:col-span-8 xl:col-span-9 w-full">
            {activeTab === 'transactions' && (
              <TransactionHistoryTab
                transactions={INITIAL_TRANSACTIONS}
                onSelectTicket={setSelectedTicket}
              />
            )}

            {activeTab === 'profile' && (
              <PersonalInfoTab
                fullName={fullName}
                setFullName={setFullName}
                email={user?.email}
                phone={phone}
                setPhone={setPhone}
                birthday={birthday}
                setBirthday={setBirthday}
                gender={gender}
                setGender={setGender}
                onReset={handleResetProfileForm}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationsTab
                notifications={notifications}
                setNotifications={setNotifications}
                unreadNotifCount={unreadNotifCount}
              />
            )}
          </section>
        </div>
      </div>

      {/* MODAL 1: E-TICKET PREVIEW */}
      <ETicketModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* MODAL 2: LOGOUT CONFIRMATION */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </div>
  );
};

export default ClientProfile;
