import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Brand from '../components/Client/Brand';

const AuthLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#f7f7f7] text-(--client-text)">
    <header className="border-b border-(--client-border) bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand compact />
        <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-500 transition hover:text-neutral-950"><ArrowLeft size={18} />Quay lại Trang chủ</Link>
      </div>
    </header>
    <main className="flex flex-1 items-center justify-center px-4 py-10"><Outlet /></main>
    <footer className="border-t border-(--client-border) bg-white px-4 py-5 text-sm text-(--client-muted)">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
        <span>© 2026 NexCinema Vietnam. Tất cả quyền được bảo lưu.</span>
        <span className="flex flex-wrap items-center justify-center gap-5"><span className="flex items-center gap-1"><Phone size={15} className="text-(--client-primary)" />Hotline: 1900 8888</span><span className="flex items-center gap-1"><Mail size={15} className="text-(--client-primary)" />support@nexcinema.vn</span></span>
      </div>
    </footer>
  </div>
);

export default AuthLayout;
