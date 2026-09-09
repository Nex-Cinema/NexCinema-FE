import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Ticket, ChevronDown, User, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { getMovies } from '../api/movieApi';
import { getMovieVisuals } from '../utils/visualHelper';
import toast from 'react-hot-toast';
import InfoModal, { ModalType } from './Common/InfoModal';
import profileAvatar from '../assets/profile.png';
import UITLogo from '../assets/LogoUIT2.jpg';

interface MovieItem {
  MaPhim?: string | number;
  _id?: string | number;
  TenPhim?: string;
  title?: string;
  HinhAnh?: string;
  ThoiLuong?: number;
  TheLoai?: string;
}

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Auth state
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  const storedName = localStorage.getItem("userName");
  const isLoggedIn = Boolean(token && role === "CUSTOMER");
  const displayName = storedName || "Hoàng Nam";

  // Check active navigation link
  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    setIsDropdownOpen(false);
    toast.loading("Đang đăng xuất...");
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosClient.post("/auth/logout", { refreshToken });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");
      localStorage.removeItem("userCode");
      localStorage.removeItem("userInfo");

      toast.dismiss();
      toast.success("Đã đăng xuất tài khoản!");
      navigate("/login");
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await getMovies({ keyword: query.trim(), limit: 6 });
        const movies = res?.data || res || [];
        setSearchResults(Array.isArray(movies) ? movies : []);
      } catch (err) {
        console.error('Search error:', err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Navigate to ticket history
  const handleTicketHistoryClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login", { state: { from: "/profile" } });
    }
  };

  // Scroll to showtimes
  const handleShowtimesClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('showtimes-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      const el = document.getElementById('showtimes-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-[#F4F4F6] border-b border-gray-300/80 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">

          {/* LEFT: LOGO */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              src={UITLogo} 
              alt="NexCinema Logo" 
              className="h-10 w-auto object-contain"
              onError={(e) => {
                // Fallback to text logo if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-2xl font-black font-display text-[#8B1D1D] tracking-tight">
              NexCinema
            </span>
          </Link>

          {/* CENTER: NAVIGATION LINKS */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-bold text-[#4A2E2B]">
            <Link 
              to="/movies/now-showing" 
              className={`transition-colors hover:text-[#8B1D1D] ${isActive('/movies/now-showing') ? 'text-[#8B1D1D]' : ''}`}
            >
              Phim đang chiếu
            </Link>

            <Link 
              to="/movies/coming-soon" 
              className={`transition-colors hover:text-[#8B1D1D] ${isActive('/movies/coming-soon') ? 'text-[#8B1D1D]' : ''}`}
            >
              Phim sắp chiếu
            </Link>

            <button 
              onClick={handleShowtimesClick}
              className="transition-colors hover:text-[#8B1D1D] cursor-pointer"
            >
              Lịch chiếu
            </button>

            <button 
              onClick={() => setModalType('PRICE_RULES')}
              className="transition-colors hover:text-[#8B1D1D] cursor-pointer whitespace-nowrap"
            >
              Giá vé & Quy định
            </button>

            <button 
              onClick={() => setModalType('CINEMA_INTRO')}
              className="transition-colors hover:text-[#8B1D1D] cursor-pointer whitespace-nowrap"
            >
              Giới thiệu rạp
            </button>
          </nav>

          {/* SEARCH FIELD */}
          <div className="relative hidden md:block" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Tìm phim, thể loại..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-52 lg:w-64 focus:w-72 bg-[#E6E6E9] hover:bg-[#DFDFE2] focus:bg-white border border-transparent focus:border-gray-300 rounded-full py-2 pl-9 pr-8 text-xs font-medium text-gray-800 placeholder:text-gray-500 outline-none transition-all duration-300 shadow-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="p-2.5 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold px-3">
                  Kết quả tìm kiếm ({searchResults.length})
                </div>
                <div className="divide-y divide-gray-100">
                  {searchResults.map((movie) => {
                    const visuals = getMovieVisuals(movie);
                    return (
                      <Link
                        key={movie.MaPhim || movie._id}
                        to={`/movie/${movie.MaPhim || movie._id}`}
                        onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors group"
                      >
                        <img
                          src={movie.HinhAnh || visuals.thumbnail}
                          alt={movie.TenPhim || movie.title}
                          className="w-10 h-14 object-cover rounded-md shrink-0 border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = visuals.thumbnail;
                          }}
                        />
                        <div className="flex flex-col min-w-0">
                          <span className="text-gray-900 font-bold text-xs truncate group-hover:text-[#8B1D1D] transition-colors">
                            {movie.TenPhim || movie.title}
                          </span>
                          <span className="text-gray-500 text-[11px] mt-0.5">
                            {movie.ThoiLuong ? `${movie.ThoiLuong} phút` : ''} {movie.TheLoai ? `• ${movie.TheLoai}` : ''}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl p-4 text-xs text-gray-500 text-center shadow-xl z-50">
                Không tìm thấy phim phù hợp...
              </div>
            )}
          </div>

          {/* RIGHT SECTION: TICKET HISTORY & USER PROFILE */}
          <div className="flex items-center gap-4 sm:gap-6">

            {/* Lịch sử đặt vé */}
            <button
              onClick={handleTicketHistoryClick}
              className="flex items-center gap-2 text-sm font-bold text-[#4A2E2B] hover:text-[#8B1D1D] transition-colors cursor-pointer"
              title="Lịch sử đặt vé"
            >
              <Ticket className="w-5 h-5 text-[#4A2E2B]" />
              <span className="hidden sm:inline-block whitespace-nowrap">Lịch sử đặt vé</span>
            </button>

            {/* User Avatar & Name */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 cursor-pointer group focus:outline-none"
              >
                <img
                  src={profileAvatar}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-gray-300 group-hover:border-[#8B1D1D] transition-colors"
                  onError={(e) => {
                    // Fallback to initial avatar
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="text-sm font-bold text-[#4A2E2B] group-hover:text-[#8B1D1D] transition-colors hidden sm:inline-block">
                  {displayName}
                </span>
                <ChevronDown className={`w-4 h-4 text-[#4A2E2B] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 py-1 text-left animate-in zoom-in duration-150">
                  <div className="px-4 py-2.5 border-b border-gray-100">
                    <p className="text-[11px] text-gray-500 font-medium">Xin chào,</p>
                    <p className="text-xs font-bold text-gray-900 truncate">{displayName}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-[#8B1D1D] hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    Tài khoản
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-gray-700 hover:text-[#8B1D1D] hover:bg-gray-50 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-gray-500" />
                    Lịch sử đặt vé
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    {isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#8B1D1D] hover:bg-red-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Đăng nhập
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-1.5 text-gray-700 hover:text-black cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#F4F4F6] border-b border-gray-300 px-6 py-4 flex flex-col gap-3">
            <div className="relative md:hidden mb-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm phim, thể loại..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#E6E6E9] border border-gray-300 rounded-full py-2 pl-9 pr-4 text-xs font-medium text-gray-800 placeholder:text-gray-500 outline-none"
              />
            </div>

            <nav className="flex flex-col gap-2.5 text-sm font-bold text-[#4A2E2B]">
              <Link 
                to="/movies/now-showing" 
                onClick={() => setIsMenuOpen(false)}
                className="py-1.5 border-b border-gray-200/60 hover:text-[#8B1D1D]"
              >
                Phim đang chiếu
              </Link>
              <Link 
                to="/movies/coming-soon" 
                onClick={() => setIsMenuOpen(false)}
                className="py-1.5 border-b border-gray-200/60 hover:text-[#8B1D1D]"
              >
                Phim sắp chiếu
              </Link>
              <button 
                onClick={() => { setIsMenuOpen(false); handleShowtimesClick(); }}
                className="py-1.5 text-left border-b border-gray-200/60 hover:text-[#8B1D1D] cursor-pointer"
              >
                Lịch chiếu
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); setModalType('PRICE_RULES'); }}
                className="py-1.5 text-left border-b border-gray-200/60 hover:text-[#8B1D1D] cursor-pointer"
              >
                Giá vé & Quy định
              </button>
              <button 
                onClick={() => { setIsMenuOpen(false); setModalType('CINEMA_INTRO'); }}
                className="py-1.5 text-left hover:text-[#8B1D1D] cursor-pointer"
              >
                Giới thiệu rạp
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="h-18"></div>

      {/* Modal */}
      <InfoModal 
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        modalType={modalType}
      />
    </>
  );
};

export default Navbar;
