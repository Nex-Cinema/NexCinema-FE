import React from 'react';
import HeroBanner from './HeroBanner';
import QuickBookingWidget from '@/components/common/QuickBookingWidget';
import NowShowingSection from './NowShowingSection';
import TodayShowtimesSection from './TodayShowtimesSection';
import CinemaComplexInfoSection from './CinemaComplexInfoSection';
import NewsSection from './NewsSection';

export const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#f5f3f3]">
      {/* 1. Hero Campaign Banner */}
      <HeroBanner />

      {/* 2. Quick Booking Widget Floating Header */}
      <QuickBookingWidget />

      {/* 3. Movie Listing Section (Phim Đang Chiếu & Phim Sắp Chiếu) */}
      <NowShowingSection />

      {/* 4. Today's Showtime Schedule (Lịch Chiếu Hôm Nay) */}
      <TodayShowtimesSection />

      {/* 5. Cinema Complex Information (TIÊU CHUẨN ĐIỆN ẢNH QUỐC TẾ - NexCinema Complex Lê Duẩn) */}
      <CinemaComplexInfoSection />

      {/* 6. Cinema News & Events (Góc Điện Ảnh NexCinema) */}
      <NewsSection />
    </div>
  );
};

export default Home;
