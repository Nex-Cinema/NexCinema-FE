import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Play,
  Share2,
  Clock,
  Calendar,
  ShieldAlert,
  Languages,
  Film,
  Star,
  Ticket,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  X,
  Users,
  ArrowRight,
  Home,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CastMember {
  name: string;
  role: string;
  avatarUrl: string;
}

interface ShowtimeSlot {
  id: string;
  time: string;
  seatsLeft: number;
  isHot?: boolean;
  isSoldOut?: boolean;
}

interface RoomShowtimeGroup {
  roomId: string;
  roomName: string;
  formatTag: string;
  formatColorClass: string;
  techInfo: string;
  slots: ShowtimeSlot[];
}

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // ── States ────────────────────────────────────────────────────────
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-10-28');
  const [selectedShowtime, setSelectedShowtime] = useState<{
    slotId: string;
    time: string;
    roomName: string;
    formatTag: string;
  } | null>(null);

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // ── Mock Movie Data (Dune 2 as primary reference) ────────────────
  const movie = {
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
      'Dune: Hành Tinh Cát - Phần 2 tiếp tục cuộc hành trình huyền thoại của Paul Atreides khi anh hợp nhất cùng Chani và tộc người Fremen trong hành trình báo thù những kẻ đã hủy hoại gia đình mình. Đứng trước sự lựa chọn giữa tình yêu của cuộc đời và số phận của vũ trụ, Paul phải đối mặt với thử thách tâm linh tối cao cùng những cuộc chiến vĩ đại nhất để ngăn chặn một tương lai đen tối mà chỉ anh mới có thể thấy trước...',
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
    ] as CastMember[],
  };

  // ── Date Tabs ──────────────────────────────────────────────────────
  const datesList = [
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
  const sidebarMovies = [
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
    navigate(`/booking/${selectedShowtime.slotId}`);
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
          <Link to="/" className="hover:text-[#d71920] transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span>Trang chủ</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f5e5e]" />
          <Link to="/movies/now-showing" className="hover:text-[#d71920] transition-colors">
            Phim đang chiếu
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5f5e5e]" />
          <span className="text-[#1b1c1c] font-semibold truncate">{movie.title}</span>
        </div>
      </div>

      {/* ── 1. MOVIE HERO BANNER / TRAILER ENTRY ─────────────────── */}
      <section className="relative w-full h-[460px] md:h-[540px] bg-[#1b1c1c] overflow-hidden">
        {/* Background Visual */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{ backgroundImage: `url('${movie.backdropUrl}')` }}
        />
        {/* Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b1c1c] via-[#1b1c1c]/60 to-black/40" />
        <div className="absolute inset-0 bg-radial from-transparent to-black/70" />

        {/* Hero Banner Content */}
        <div className="relative max-w-[1280px] h-full mx-auto px-4 lg:px-6 flex flex-col justify-end pb-12 z-10">
          <div className="flex flex-col items-start gap-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1b1c1c]/80 text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#d71920] animate-pulse" />
              <span>{movie.tagline}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-md">
              {movie.title}
            </h1>

            {/* Play Trailer CTA */}
            <div className="pt-1 flex items-center gap-4 flex-wrap">
              <button
                onClick={() => setIsTrailerOpen(true)}
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white/95 hover:bg-white text-[#1b1c1c] hover:text-[#d71920] rounded-lg font-bold text-sm transition-all shadow-md active:scale-95"
              >
                <div className="w-8 h-8 rounded-full bg-[#d71920] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Xem Trailer chính thức (Full HD)</span>
              </button>
              <span className="text-[#c8c6c5] text-xs hidden sm:inline">
                Thời lượng trailer: 2 phút 45 giây
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN DETAILS SECTION (2-Column 8:4 Grid) ──────────── */}
      <div className="w-full py-8">
        <div className="max-w-[1280px] mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: MAIN CONTENT (8 of 12 cols = ~68%) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* MOVIE INFO CARD */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2]">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Poster image with Rating Badge */}
                  <div className="relative w-full md:w-64 shrink-0 aspect-[2/3] rounded-lg overflow-hidden shadow-md bg-[#efeded]">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-[#d71920] text-white font-extrabold text-sm px-2.5 py-1 rounded shadow-md tracking-wide">
                      {movie.ratingBadge}
                    </div>
                  </div>

                  {/* Metadata Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-black text-[#1b1c1c] tracking-tight">
                          {movie.title}
                        </h2>
                        <p className="text-sm text-[#5f5e5e] mt-0.5">{movie.englishTitle}</p>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <Clock className="w-4 h-4 text-[#d71920] shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Thời lượng:</span>
                          <span>{movie.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <Calendar className="w-4 h-4 text-[#d71920] shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Khởi chiếu:</span>
                          <span>{movie.releaseDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <ShieldAlert className="w-4 h-4 text-[#d71920] shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Độ tuổi:</span>
                          <span className="text-[#ba1a1a] font-bold">{movie.ageRatingText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <Languages className="w-4 h-4 text-[#d71920] shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Ngôn ngữ:</span>
                          <span>{movie.language}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <Film className="w-4 h-4 text-[#d71920] shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Định dạng:</span>
                          <span>{movie.formatText}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#5f5e5e]">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                          <span className="text-[#1b1c1c] font-bold">Đánh giá:</span>
                          <span className="font-extrabold text-[#1b1c1c]">{movie.ratingScore}</span>
                          <span className="text-[#5f5e5e]">({movie.reviewCount})</span>
                        </div>
                      </div>

                      {/* Genre line */}
                      <div className="pt-3 border-t border-[#e4e2e2] flex items-baseline gap-1.5 text-xs text-[#5f5e5e]">
                        <span className="text-[#1b1c1c] font-bold">Thể loại:</span>
                        <span className="text-[#5d3f3c]">{movie.genres}</span>
                      </div>
                    </div>

                    {/* Primary CTA Button Row */}
                    <div className="mt-6 pt-4 border-t border-[#e4e2e2] flex items-center gap-3 flex-wrap">
                      <button
                        onClick={handleScrollToShowtimes}
                        className="flex-1 min-w-[200px] h-12 bg-[#d71920] hover:bg-[#ae0011] text-white rounded-lg font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                      >
                        <Ticket className="w-5 h-5" />
                        <span>ĐẶT VÉ NGAY</span>
                      </button>

                      <button
                        onClick={handleShareMovie}
                        className="h-12 w-12 rounded-lg bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c] flex items-center justify-center transition-colors shadow-sm"
                        title="Chia sẻ phim"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* DIRECTOR & CAST SECTION */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#d71920]" />
                  <h3 className="font-bold text-lg text-[#1b1c1c]">Đạo diễn & Diễn viên</h3>
                </div>

                {/* Director */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="text-xs font-semibold text-[#5f5e5e] w-24 shrink-0">
                    Đạo diễn:
                  </span>
                  <div className="inline-flex items-center gap-2 bg-[#f5f3f3] px-3 py-1.5 rounded-lg shadow-sm">
                    <img
                      src={movie.director.avatarUrl}
                      alt={movie.director.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="font-semibold text-xs text-[#1b1c1c]">
                      {movie.director.name}
                    </span>
                  </div>
                </div>

                {/* Cast Members */}
                <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 pt-1">
                  <span className="text-xs font-semibold text-[#5f5e5e] w-24 shrink-0 sm:pt-2">
                    Diễn viên:
                  </span>
                  <div className="flex flex-wrap gap-2 flex-1">
                    {movie.cast.map((actor, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 bg-[#f5f3f3] hover:bg-[#e4e2e2] px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <img
                          src={actor.avatarUrl}
                          alt={actor.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div className="flex flex-col text-left">
                          <span className="font-semibold text-xs text-[#1b1c1c]">{actor.name}</span>
                          <span className="text-[11px] text-[#5f5e5e]">{actor.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MOVIE DESCRIPTION (NỘI DUNG PHIM) */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-3">
                <h2 className="text-lg font-bold text-[#1b1c1c]">NỘI DUNG PHIM</h2>
                <div className="relative">
                  <p
                    className={`text-sm text-[#5f5e5e] leading-relaxed transition-all duration-300 ${
                      isSynopsisExpanded ? '' : 'line-clamp-3'
                    }`}
                  >
                    {movie.synopsis}
                  </p>
                  <button
                    onClick={() => setIsSynopsisExpanded(!isSynopsisExpanded)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#d71920] hover:underline cursor-pointer"
                  >
                    <span>{isSynopsisExpanded ? 'Thu gọn' : 'Xem thêm'}</span>
                    {isSynopsisExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ── 3. SHOWTIMES SECTION (LỊCH CHIẾU) ──────────────── */}
              <section
                id="lich-chieu-section"
                className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-6 scroll-mt-24"
              >
                {/* Section Header */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-[#d71920]" />
                    <h2 className="text-xl font-extrabold text-[#1b1c1c]">LỊCH CHIẾU</h2>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#5f5e5e]">
                    <MapPin className="w-4 h-4 text-[#d71920] shrink-0" />
                    <span>NexCinema Complex Lê Duẩn • Tầng 4, TTTM Diamond Plaza, 34 Lê Duẩn, Q.1</span>
                  </div>
                </div>

                {/* Date Ribbon Tabs */}
                <div className="w-full overflow-x-auto pb-1 flex items-center gap-2 scrollbar-none">
                  {datesList.map((d) => {
                    const isSelected = selectedDate === d.dateStr;
                    return (
                      <button
                        key={d.dateStr}
                        onClick={() => setSelectedDate(d.dateStr)}
                        className={`shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-lg font-semibold text-xs transition-colors shadow-sm ${
                          isSelected
                            ? 'bg-[#d71920] text-white font-bold'
                            : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] text-[#1b1c1c]'
                        }`}
                      >
                        <span className="text-[11px] opacity-80 font-normal">{d.dayName}</span>
                        <span className="text-xs">{d.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Showtime Groups by Room */}
                <div className="flex flex-col gap-6 pt-2">
                  {roomGroups.map((group) => (
                    <div key={group.roomId} className="flex flex-col gap-3 pt-3 border-t border-[#e4e2e2]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${group.formatColorClass}`}
                          >
                            {group.formatTag}
                          </span>
                          <h3 className="font-bold text-sm text-[#1b1c1c]">{group.roomName}</h3>
                        </div>
                        <span className="text-xs text-[#5f5e5e] hidden sm:inline">
                          {group.techInfo}
                        </span>
                      </div>

                      {/* Slots Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
                        {group.slots.map((slot) => {
                          const isSelected = selectedShowtime?.slotId === slot.id;
                          if (slot.isSoldOut) {
                            return (
                              <div
                                key={slot.id}
                                className="p-3 rounded-lg bg-[#e4e2e2]/60 text-left flex flex-col opacity-60 cursor-not-allowed select-none border border-[#e4e2e2]"
                              >
                                <span className="font-bold text-sm text-[#5f5e5e] line-through">
                                  {slot.time}
                                </span>
                                <span className="text-[11px] text-[#ba1a1a] font-bold mt-0.5">
                                  Hết vé
                                </span>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={slot.id}
                              onClick={() => handleSelectSlot(slot, group)}
                              className={`p-3 rounded-lg text-left transition-all flex flex-col shadow-sm border ${
                                isSelected
                                  ? 'bg-[#d71920] text-white border-[#d71920]'
                                  : 'bg-[#f5f3f3] hover:bg-[#e4e2e2] hover:border-[#d71920] text-[#1b1c1c] border-[#e4e2e2]'
                              }`}
                            >
                              <span className="font-extrabold text-sm">{slot.time}</span>
                              <span
                                className={`text-[11px] mt-0.5 ${
                                  isSelected
                                    ? 'text-white/90 font-medium'
                                    : slot.isHot
                                    ? 'text-[#d71920] font-bold'
                                    : 'text-[#5f5e5e]'
                                }`}
                              >
                                {slot.isHot ? 'Còn 8 ghế (Sắp hết)' : `Còn ${slot.seatsLeft} ghế`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* INLINE SEAT SELECTION CALLOUT BAR */}
                {selectedShowtime && (
                  <div className="bg-[#efeded] p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md border border-[#d71920]/30 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <div className="w-10 h-10 rounded-full bg-[#d71920] text-white flex items-center justify-center shrink-0 shadow-md">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs text-[#5f5e5e]">Suất chiếu đã chọn:</span>
                        <span className="font-bold text-sm text-[#1b1c1c]">
                          {selectedShowtime.time} • {selectedShowtime.roomName} • Hôm nay
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleContinueToSeatSelection}
                      className="w-full sm:w-auto px-6 h-11 bg-[#d71920] hover:bg-[#ae0011] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98]"
                    >
                      <span>CHỌN GHẾ & TIẾP TỤC</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT SIDEBAR: CURRENTLY SHOWING (4 of 12 cols = ~32%) */}
            <aside className="lg:col-span-4 flex flex-col gap-4 sticky top-24">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e4e2e2] flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#e4e2e2]">
                  <h2 className="font-extrabold text-base text-[#1b1c1c] tracking-tight">
                    PHIM ĐANG CHIẾU
                  </h2>
                  <Film className="w-5 h-5 text-[#d71920]" />
                </div>

                <div className="flex flex-col gap-4">
                  {sidebarMovies.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/movie/${item.id}`)}
                      className="group flex flex-col gap-2 cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-xl bg-[#efeded] shadow-sm aspect-[4/3]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-3">
                          <button className="bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center justify-center gap-1.5 shadow-md active:scale-95">
                            <Ticket className="w-3.5 h-3.5" />
                            <span>Đặt vé</span>
                          </button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-xs text-[#1b1c1c] group-hover:text-[#d71920] transition-colors truncate">
                        {item.title}
                      </h4>
                    </div>
                  ))}
                </div>

                {/* More Movies Link */}
                <Link
                  to="/movies/now-showing"
                  className="mt-2 pt-3 border-t border-[#e4e2e2] text-center text-xs font-bold text-[#d71920] hover:text-[#ae0011] transition-colors flex items-center justify-center gap-1"
                >
                  <span>XEM THÊM PHIM ĐANG CHIẾU</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* ── TRAILER MODAL OVERLAY ─────────────────────────────────── */}
      {isTrailerOpen && (
        <div
          onClick={() => setIsTrailerOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#1b1c1c] rounded-xl overflow-hidden shadow-2xl flex flex-col border border-white/10"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#1b1c1c] border-b border-white/10 text-white">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 text-[#d71920] fill-[#d71920]" />
                <span className="font-bold text-xs sm:text-sm">
                  {movie.title} (Trailer Chính Thức)
                </span>
              </div>
              <button
                onClick={() => setIsTrailerOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
              <iframe
                src={movie.trailerUrl}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
