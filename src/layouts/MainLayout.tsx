import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f3f3] text-[#1b1c1c] antialiased">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
