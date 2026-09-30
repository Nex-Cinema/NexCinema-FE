
import { useState } from 'react';
import { Menu } from 'lucide-react';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setIsSidebarCollapsed((collapsed) => !collapsed);
      return;
    }
    setIsSidebarOpen((open) => !open);
  };

  return (
    <div className={`admin-app min-h-screen bg-[var(--admin-canvas)] text-[var(--admin-text)] ${isSidebarCollapsed ? 'admin-app--sidebar-collapsed' : ''}`}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu quản trị"
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="admin-content-shell min-h-screen">
        <header className="admin-mobile-header">
          <button
            type="button"
            className="admin-icon-button"
            aria-label="Ẩn hoặc hiện menu quản trị"
            aria-pressed={isSidebarCollapsed}
            onClick={handleSidebarToggle}
          >
            <Menu size={20} strokeWidth={1.8} />
          </button>
          <span className="admin-wordmark">NEX<span>CINEMA</span></span>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
