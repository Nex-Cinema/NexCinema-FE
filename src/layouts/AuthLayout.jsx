import { Outlet } from 'react-router-dom';
import Brand from '../components/Client/Brand';

const AuthLayout = () => (
  <div className="flex min-h-screen flex-col bg-[#f7f7f7] text-(--client-text)">
    <header className="border-b border-(--client-border) bg-white">
      <div className="mx-auto flex h-18 max-w-7xl items-center px-4 sm:px-6 lg:px-8"><Brand compact /></div>
    </header>
    <main className="flex flex-1 items-center justify-center px-4 py-10"><Outlet /></main>
    <footer className="border-t border-(--client-border) bg-white px-4 py-5 text-center text-xs text-(--client-muted)">
      © 2026 NexCinema · Trải nghiệm đặt vé điện ảnh trực tuyến
    </footer>
  </div>
);

export default AuthLayout;
