import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { ChevronRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';

import { MovieHero } from '@/features/movies/components/MovieHero';
import { MovieInfoCard } from '@/features/movies/components/MovieInfoCard';
import { MovieCastSection } from '@/features/movies/components/MovieCastSection';
import { MovieSynopsisSection } from '@/features/movies/components/MovieSynopsisSection';
import { MovieShowtimesSection } from '@/features/movies/components/MovieShowtimesSection';
import { NowShowingSidebar } from '@/features/movies/components/NowShowingSidebar';
import { MovieTrailerModal } from '@/features/movies/components/MovieTrailerModal';

import {
  MovieDetailsData,
  ShowtimeSlot,
  RoomShowtimeGroup,
  SelectedShowtime,
  DateTabItem,
  SidebarMovie,
} from '@/features/movies/types/movieDetails.type';

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();

  // ── Page Orchestration States ────────────────────────────────────
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-10-28');
  const [selectedShowtime, setSelectedShowtime] = useState<SelectedShowtime | null>(null);

  // Scroll to showtimes section if hash or query present, else top
  useEffect(() => {
    if (window.location.hash === '#lich-chieu-section' || window.location.search.includes('booking=true')) {
      setTimeout(() => {
        const el = document.getElementById('lich-chieu-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  // ── Mock Movie Data (Dune 2 as primary reference) ────────────────
  const movie: MovieDetailsData = {
    id: id || 'dune2',
    title: 'Dune: Hành Tinh Cát - Phần 2',
    englishTitle: 'Dune: Part Two (2024)',
    tagline: 'Bom tấn chiếu rạp toàn cầu • IMAX Laser',
    ratingBadge: 'C16',
    ageRatingText: 'C16 (Khán giả từ 16 tuổi trở lên)',
    duration: '166 phút',
    releaseDate: '01/03/2024',
    language: 'Tiếng Anh - Phụ đề VN',
    formatText: '2D, IMAX Laser, Dolby Atmos',
    ratingScore: '9.4/10',
    reviewCount: '1.4k lượt xem',
    genres: 'Khoa học viễn tưởng, Hành động, Phiêu lưu',
    synopsis:
      'Dune: Hành Tinh Cát - Phần 2 tiếp tục cuộc hành trình huyền thoại của Paul Atreides khi anh hợp nhất cùng Chani và tộc người Fremen trong hành trình báo thù những kẻ đã hủy hoại gia đình mình. Đứng trước sự lựa chọn giữa tình yêu của cuộc đời và số phận của vũ vũ trụ, Paul phải đối mặt với thử thách tâm linh tối cao cùng những cuộc chiến vĩ đại nhất để ngăn chặn một tương lai đen tối mà chỉ anh mới có thể thấy trước...',
    backdropUrl:
      'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
    posterUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBQR0Gi36A8a1Os8Ifgk9xdTOtDMMoW8YRGGTU1qPt1v9_clKv9IMrOIay1VJSqgzx47kYDwJ7UEEfAN9qSTPp2X583ldDayNuzyHujKw8pVa5IYL8tn5I32tVk4XD-xd0TXujchAhkNG2HDBvCptorUeiMFrYhx-rHYpTp_Z8eIM0qGx4gn5g0thOZYtbGfDhRz0LAs5eWVWLaNpbO_ahVbbNowPy7vSeApnHijdEkPaHhfUc0WDCnDw',
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1',
    director: {
      name: 'Denis Villeneuve',
      avatarUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    cast: [
      {
        name: 'Timothée Chalamet',
        role: 'Paul Atreides',
        avatarUrl:
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Zendaya',
        role: 'Chani',
        avatarUrl:
          'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Rebecca Ferguson',
        role: 'Lady Jessica',
        avatarUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Javier Bardem',
        role: 'Stilgar',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Austin Butler',
        role: 'Feyd-Rautha',
        avatarUrl:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      },
    ],
  };

  // ── Date Tabs Data ────────────────────────────────────────────────
  const datesList: DateTabItem[] = [
    { dateStr: '2024-10-28', dayName: 'Thứ Hai', label: 'Hôm nay 28/10' },
    { dateStr: '2024-10-29', dayName: 'Thứ Ba', label: 'Ngày mai 29/10' },
    { dateStr: '2024-10-30', dayName: 'Thứ Tư', label: '30/10' },
    { dateStr: '2024-10-31', dayName: 'Thứ Năm', label: '31/10' },
    { dateStr: '2024-11-01', dayName: 'Thứ Sáu', label: '01/11' },
    { dateStr: '2024-11-02', dayName: 'Thứ Bảy', label: '02/11' },
    { dateStr: '2024-11-03', dayName: 'Chủ Nhật', label: '03/11' },
  ];

  // ── Showtimes Data ────────────────────────────────────────────────
  const roomGroups: RoomShowtimeGroup[] = [
    {
      roomId: 'room-imax',
      roomName: 'Phòng chiếu IMAX Laser',
      formatTag: 'IMAX Laser',
      formatColorClass: 'bg-[#0071b6] text-white',
      techInfo: 'Âm thanh 12 kênh Immersive',
      slots: [
        { id: 'st-101', time: '13:30', seatsLeft: 48 },
        { id: 'st-102', time: '16:45', seatsLeft: 22 },
        { id: 'st-103', time: '19:30', seatsLeft: 8, isHot: true },
        { id: 'st-104', time: '22:15', seatsLeft: 64 },
      ],
    },
    {
      roomId: 'room-02',
      roomName: 'Phòng chiếu 02',
      formatTag: '2D Standard',
      formatColorClass: 'bg-[#e4e2e2] text-[#1b1c1c]',
      techInfo: 'Máy chiếu 4K Laser',
      slots: [
        { id: 'st-201', time: '10:00', seatsLeft: 85 },
        { id: 'st-202', time: '14:15', seatsLeft: 51 },
        { id: 'st-203', time: '17:40', seatsLeft: 30 },
        { id: 'st-204', time: '20:45', seatsLeft: 0, isSoldOut: true },
      ],
    },
    {
      roomId: 'room-01',
      roomName: 'Phòng chiếu 01',
      formatTag: 'Dolby Atmos',
      formatColorClass: 'bg-[#00588f] text-white',
      techInfo: 'Hệ thống vòm 64 loa',
      slots: [
        { id: 'st-301', time: '11:15', seatsLeft: 62 },
        { id: 'st-302', time: '15:00', seatsLeft: 40 },
        { id: 'st-303', time: '18:30', seatsLeft: 15 },
      ],
    },
  ];

  // ── Currently Showing Sidebar Movies ─────────────────────────────
  const sidebarMovies: SidebarMovie[] = [
    {
      id: 'godzilla',
      title: 'Godzilla x Kong: Đế Chế Mới',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCJorOGi6KDI5vPAzSKvI2Yg-Akq-cHHn8gJxHIGv-nbfHaGm3LceKdC5MgCwOc3BJ3sCUiG98jVgZo9uykKxsjWVLeSJSXzbmtiySeLfHUznIKaO7SrzMidOX_oH-zslozH__r71_HshWFSbDz4yBmn4TwFTGEOKu7pgmk5t5B0B0i9epnLJOIZLJJkYTSjfDzB_SPBqAWSRZMFyUyS3yfaCprNK6NnNkx0tmNFOBbJy2nUpmmCp3Kpg',
    },
    {
      id: 'latmat7',
      title: 'Lật Mặt 7: Một Điều Ước',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBQApIsluMZkKbasRzODxDYeMICC7Hn32qSpVKicnUVan2QN8PYUi4widx9PygF4tNg5DKjHPabXGQWY8C1RMD02AcJda1m2OkLKHxCILUpwPQhkN6zsQjkZ0BLFKlo_jaSFvxiXouCMS2l1TXQESY0sBsR3DDi2X-vfORjYed0gusqndXQmA3c0y8ARV01bFLdTbYlUrptKsEYRrY7cfd78QFxzysFbVrDHB_Hfunsa-byhGCIu3BTtw',
    },
    {
      id: 'kungfupanda',
      title: 'Kung Fu Panda 4',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EOuVahVJi3kOUG70NMtD3MIwfQmtweFx0gsQOvwT0PBBNj9nIVTv4egOfGBVZyQP4FmdudSWXfcP5jgURMrYNAzQmIpP9CZHW3RKHM24IPBfUx738RhY2DOgSkVHLCxmxFMAZ1XHID82l9pXYuFPrQILY38Ysi1b4sUrkUPGGmG5jOTGhey31l1IwOQM5-FIsFY0ZaClKDtrCG7VL93E3se1bY4ym0JSSw4p3DSpwJurP_GG32ORDQ',
    },
    {
      id: 'exhuma',
      title: 'Exhuma: Quật Mộ Trùng Ma',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCRLB2f466XptyubK7cmvac8rjUBGqhcOmdGU3fTN9gpZr2y5vXPtyD84dSH_eNpHzJ2akA-EjWXY7Wq3qMkDGksZXZY0RAwrOKmeBlGK5us3FcJvxTW2pnxrsVMpG8IXMEYnsuUfs3LpRlU5uhB4I0oqMz4yq8jU_zwQdqQu55q0yFRDIvZzMfmTdwbMY_9244Yoh8lfxYdOdSrotSeXaAo02WpFC2aBhA_6_LVs8n4uYzMblXD9GYbQ',
    },
  ];

  // ── Actions ───────────────────────────────────────────────────────
  const handleScrollToShowtimes = () => {
    const el = document.getElementById('lich-chieu-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectSlot = (slot: ShowtimeSlot, group: RoomShowtimeGroup) => {
    if (slot.isSoldOut) return;
    setSelectedShowtime({
      slotId: slot.id,
      time: slot.time,
      roomName: group.roomName,
      formatTag: group.formatTag,
    });
  };

  const handleContinueToSeatSelection = () => {
    if (!selectedShowtime) {
      toast.error('Vui lòng chọn 1 suất chiếu trước!');
      return;
    }
    navigate(ROUTES.BOOKING.SEAT_SELECTION(selectedShowtime.slotId));
  };

  const handleShareMovie = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép liên kết phim vào bộ nhớ tạm!');
    }
  };

  return (
    <div className="w-full bg-[#f5f3f3] text-[#1b1c1c] min-h-screen">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="w-full bg-white shadow-sm border-b border-[#e4e2e2]">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6 py-2.5 flex items-center gap-1.5 text-xs text-[#5f5e5e]">
          <Link to={ROUTES.HOME} className="hover:text-[#d71920] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f5e5e]" />
          <Link to={ROUTES.MOVIES.NOW_SHOWING} className="hover:text-[#d71920] transition-colors">
            Phim đang chiếu
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f5e5e]" />
          <span className="text-[#1b1c1c] font-semibold truncate">{movie.title}</span>
        </div>
      </div>

      {/* ── 1. MOVIE HERO BANNER / TRAILER ENTRY ─────────────────── */}
      <MovieHero
        backdropUrl={movie.backdropUrl}
        tagline={movie.tagline}
        title={movie.title}
        onOpenTrailer={() => setIsTrailerOpen(true)}
      />

      {/* ── 2. MAIN DETAILS SECTION (2-Column 8:4 Grid) ──────────── */}
      <div className="w-full py-8">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: MAIN CONTENT (8 of 12 cols = ~68%) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <MovieInfoCard
                movie={movie}
                onScrollToShowtimes={handleScrollToShowtimes}
                onShareMovie={handleShareMovie}
              />

              <MovieCastSection
                director={movie.director}
                cast={movie.cast}
              />

              <MovieSynopsisSection
                synopsis={movie.synopsis}
                isExpanded={isSynopsisExpanded}
                onToggleExpand={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
              />

              <MovieShowtimesSection
                datesList={datesList}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                roomGroups={roomGroups}
                selectedShowtime={selectedShowtime}
                onSelectSlot={handleSelectSlot}
                onContinueToSeatSelection={handleContinueToSeatSelection}
              />
            </div>

            {/* RIGHT SIDEBAR: CURRENTLY SHOWING (4 of 12 cols = ~32%) */}
            <NowShowingSidebar
              sidebarMovies={sidebarMovies}
              onNavigateToMovie={(movieId) => navigate(ROUTES.MOVIES.DETAIL(movieId))}
            />
          </div>
        </div>
      </div>

      {/* ── TRAILER MODAL OVERLAY ─────────────────────────────────── */}
      <MovieTrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        title={movie.title}
        trailerUrl={movie.trailerUrl}
      />
    </div>
  );
};

export default MovieDetails;
