import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Ticket, ChevronDown, User, LogOut, Menu, X, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import InfoModal, { ModalType } from './InfoModal';
import profileAvatar from '@/assets/profile.png';
import UITLogo from '@/assets/LogoUIT2.jpg';

const SEARCH_SUGGESTIONS = [
  { id: 'dune2', title: 'Dune: Hành Tinh Cát - Phần 2', genre: 'Khoa học viễn tưởng, Hành động', rating: '9.4' },
  { id: 'godzilla', title: 'Godzilla x Kong: Đế Chế Mới', genre: 'Hành động, Quái vật', rating: '8.8' },
  { id: 'latmat7', title: 'Lật Mặt 7: Một Điều Ước', genre: 'Gia đình, Tình cảm', rating: '9.1' },
  { id: 'kungfupanda', title: 'Kung Fu Panda 4', genre: 'Hoạt hình, Hài hước', rating: '8.5' },
  { id: 'planetapes', title: 'Hành Tinh Khỉ: Vương Quốc Mới', genre: 'Hành động, Viễn tưởng', rating: '8.7' },
  { id: 'exhuma', title: 'Exhuma: Quật Mộ Trùng Ma', genre: 'Kinh dị, Bí ẩn', rating: '9.0' },
];

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const token = localStorage.getItem('accessToken');
  const role = localStorage.getItem('userRole');
  const storedName = localStorage.getItem('userName');
  const isLoggedIn = Boolean(token && role === 'CUSTOMER');
  const displayName = storedName || 'Hoàng Nam';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    toast.loading('Đang đăng xuất...');
    localStorage.clear();
    toast.dismiss();
    toast.success('Đã đăng xuất tài khoản!');
    navigate('/login');
  };

  const handleTicketHistoryClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } });
    }
  };

  const handleShowtimesClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('lich-chieu-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('lich-chieu-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 900, behavior: 'smooth' });
      }
    }
  };

  const handleSelectSearchResult = (movieId: string) => {
    setSearchQuery('');
    setIsSearchFocused(false);
    navigate(`/movie/${movieId}`);
  };

  const filteredMovies = SEARCH_SUGGESTIONS.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.06)] border-b border-gray-100">
        <div className="h-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6">
          {/* BRAND LOGO & NAV */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={UITLogo}
                alt="NexCinema Logo"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="text-2xl font-bold font-display text-[#d71920] tracking-tight">
                NexCinema
              </span>
            </Link>

            {/* NAV LINKS */}
            <nav className="hidden xl:flex items-center gap-1 font-sans">
              <Link
                to="/movies/now-showing"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/movies/now-showing')
                    ? 'bg-[#d71920] text-white font-bold'
                    : 'text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Phim đang chiếu
              </Link>

              <Link
                to="/movies/coming-soon"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive('/movies/coming-soon')
                    ? 'bg-[#d71920] text-white font-bold'
                    : 'text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Phim sắp chiếu
              </Link>

              <button
                onClick={handleShowtimesClick}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Lịch chiếu
              </button>

              <button
                onClick={() => setModalType('PRICE_RULES')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Giá vé & Quy định
              </button>

              <button
                onClick={() => setModalType('CINEMA_INTRO')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer whitespace-nowrap"
              >
                Giới thiệu rạp
              </button>
            </nav>
          </div>

          {/* SEARCH & USER ACTIONS */}
          <div className="flex items-center gap-4">
            {/* SEARCH INPUT WITH LIVE DROPDOWN */}
            <div className="hidden md:flex items-center relative" ref={searchRef}>
              <Search className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm phim, thể loại..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-[#efeded] text-gray-900 placeholder:text-gray-500 rounded-full text-xs font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#d71920] transition-all"
              />

              {/* LIVE SEARCH RESULTS DROPDOWN */}
              {isSearchFocused && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 overflow-hidden max-h-80 overflow-y-auto animate-in fade-in duration-150">
                  {filteredMovies.length > 0 ? (
                    filteredMovies.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSearchResult(item.id)}
                        className="px-4 py-2.5 hover:bg-gray-50 flex items-center justify-between cursor-pointer transition-colors border-b border-gray-50 last:border-none"
                      >
                        <div className="flex items-center gap-2.5">
                          <Film className="w-4 h-4 text-[#d71920] shrink-0" />
                          <div className="flex flex-col text-left">
                            <span className="text-xs font-bold text-gray-900">{item.title}</span>
                            <span className="text-[11px] text-gray-500">{item.genre}</span>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-amber-500">★ {item.rating}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-xs text-gray-500 text-center">
                      Không tìm thấy phim phù hợp
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* TICKET HISTORY */}
            <button
              onClick={handleTicketHistoryClick}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-[#5d3f3c] hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
              title="Lịch sử đặt vé"
            >
              <Ticket className="w-4 h-4 text-[#5d3f3c]" />
              <span className="text-xs font-semibold whitespace-nowrap">Lịch sử đặt vé</span>
            </button>

            {/* USER PROFILE & DROPDOWN */}
            <div className="flex items-center gap-2 pl-1 relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer focus:outline-none"
              >
                <img
                  src={profileAvatar}
                  alt={displayName}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="hidden lg:flex items-center gap-1 cursor-pointer select-none">
                  <span className="text-xs font-semibold text-gray-900">{displayName}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* DROPDOWN MENU */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1 text-left animate-in zoom-in duration-150">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[11px] text-gray-500">Tài khoản</p>
                    <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={handleTicketHistoryClick}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <Ticket className="w-4 h-4 text-gray-500" />
                    Lịch sử đặt vé
                  </button>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="xl:hidden p-1.5 text-gray-700 hover:text-black cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        {isMenuOpen && (
          <div className="xl:hidden bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3">
            <div className="relative md:hidden mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm phim, thể loại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#efeded] rounded-full py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none"
              />
            </div>
            <nav className="flex flex-col gap-2 font-semibold text-sm text-[#5d3f3c]">
              <Link
                to="/movies/now-showing"
                onClick={() => setIsMenuOpen(false)}
                className="py-1.5 hover:text-[#d71920]"
              >
                Phim đang chiếu
              </Link>
              <Link
                to="/movies/coming-soon"
                onClick={() => setIsMenuOpen(false)}
                className="py-1.5 hover:text-[#d71920]"
              >
                Phim sắp chiếu
              </Link>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleShowtimesClick();
                }}
                className="py-1.5 text-left hover:text-[#d71920] cursor-pointer"
              >
                Lịch chiếu
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setModalType('PRICE_RULES');
                }}
                className="py-1.5 text-left hover:text-[#d71920] cursor-pointer"
              >
                Giá vé & Quy định
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  setModalType('CINEMA_INTRO');
                }}
                className="py-1.5 text-left hover:text-[#d71920] cursor-pointer"
              >
                Giới thiệu rạp
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* MODAL */}
      <InfoModal
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        modalType={modalType}
      />
    </>
  );
};

export default Header;
