import { useState, useRef, useEffect } from 'react';
import { Search, Menu, X, Ticket, User, LogOut, ChevronDown, Film } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { getMovies } from '../api/movieApi';
import { getMovieVisuals } from '../utils/visualHelper';
import toast from 'react-hot-toast';
import InfoModal from './Common/InfoModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [modalType, setModalType] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Auth info
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  const userName = localStorage.getItem("userName");
  const isLoggedIn = token && role === "CUSTOMER";

  // Active route checking
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
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

  // Handle search with debounce
  const handleSearchChange = (e) => {
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

  // Ticket history navigation
  const handleTicketHistoryClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      toast("Vui lòng đăng nhập để xem lịch sử đặt vé", { icon: "🎟️" });
      navigate("/login", { state: { from: "/profile" } });
    }
  };

  // Scroll to showtimes on home
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
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0B1020]/90 backdrop-blur-xl border-b border-white/8 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* LEFT: NexCinema Logo */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#00c6ff] via-[#7C3AED] to-[#ff436e] p-[1.5px] shadow-lg shadow-[#ff436e]/20 group-hover:shadow-[#ff436e]/40 group-hover:scale-105 transition-all duration-300">
              <div className="w-full h-full bg-[#0B1020] rounded-[10.5px] flex items-center justify-center relative overflow-hidden">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4V20L12 12L4 4Z" fill="url(#navNexGrad1)" />
                  <path d="M20 20V4L12 12L20 20Z" fill="url(#navNexGrad2)" />
                  <defs>
                    <linearGradient id="navNexGrad1" x1="4" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#00c6ff" />
                      <stop offset="1" stopColor="#7C3AED" />
                    </linearGradient>
                    <linearGradient id="navNexGrad2" x1="20" y1="20" x2="12" y2="4" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#ff436e" />
                      <stop offset="1" stopColor="#FFB000" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight font-display text-white group-hover:text-white/90 transition-colors">
                Nex<span className="text-[#ff436e]">Cinema</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.22em] text-slate-400 font-semibold -mt-1 hidden sm:block">
                Cinema Experience
              </span>
            </div>
          </Link>

          {/* CENTER: Main Navigation (Desktop) */}
          <nav className="hidden xl:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Link 
              to="/movies/now-showing" 
              className={`transition-colors hover:text-[#FFB000] py-1 relative ${isActive('/movies/now-showing') ? 'text-[#FFB000] font-extrabold' : ''}`}
            >
              Phim đang chiếu
              {isActive('/movies/now-showing') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFB000] rounded-full"></span>}
            </Link>

            <Link 
              to="/movies/coming-soon" 
              className={`transition-colors hover:text-[#FFB000] py-1 relative ${isActive('/movies/coming-soon') ? 'text-[#FFB000] font-extrabold' : ''}`}
            >
              Phim sắp chiếu
              {isActive('/movies/coming-soon') && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#FFB000] rounded-full"></span>}
            </Link>

            <button 
              onClick={handleShowtimesClick}
              className={`transition-colors hover:text-[#FFB000] py-1 relative cursor-pointer ${isActive('/') && !location.pathname.startsWith('/movies') && !location.pathname.startsWith('/movie') ? 'text-[#FFB000]' : ''}`}
            >
              Lịch chiếu
            </button>

            <button 
              onClick={() => setModalType('PRICE_RULES')}
              className="transition-colors hover:text-[#FFB000] py-1 cursor-pointer"
            >
              Giá vé & Quy định
            </button>

            <button 
              onClick={() => setModalType('CINEMA_INTRO')}
              className="transition-colors hover:text-[#FFB000] py-1 cursor-pointer"
            >
              Giới thiệu rạp
            </button>
          </nav>

          {/* SEARCH FIELD + RIGHT ACTIONS */}
          <div className="flex items-center gap-4">

            {/* Movie Search Field (Desktop & Tablet) */}
            <div className="relative hidden md:block" ref={searchContainerRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm phim, thể loại..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-48 lg:w-60 focus:w-72 bg-white/5 border border-white/10 hover:border-white/20 rounded-full py-2 pl-9 pr-8 text-xs text-white placeholder:text-slate-400 outline-none transition-all duration-300 focus:bg-white/10 focus:border-[#FFB000]/60 focus:ring-2 focus:ring-[#FFB000]/20"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                {searchQuery && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full right-0 lg:left-0 mt-2 w-80 bg-[#131A2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-96 overflow-y-auto animate-in slide-in-from-top-4 duration-200">
                  <div className="p-2 border-b border-white/5 text-[10px] uppercase tracking-wider text-slate-400 font-bold px-3">
                    Kết quả tìm kiếm ({searchResults.length})
                  </div>
                  <div className="divide-y divide-white/5">
                    {searchResults.map((movie) => {
                      const visuals = getMovieVisuals(movie);
                      return (
                        <Link
                          key={movie.MaPhim || movie._id}
                          to={`/movie/${movie.MaPhim || movie._id}`}
                          onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                          className="flex items-center gap-3 p-3 hover:bg-white/8 transition-colors group"
                        >
                          <img
                            src={movie.HinhAnh || visuals.thumbnail}
                            alt={movie.TenPhim || movie.title}
                            className="w-10 h-14 object-cover rounded-lg shrink-0 border border-white/10"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = visuals.thumbnail;
                            }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-white font-bold text-xs truncate group-hover:text-[#FFB000] transition-colors">
                              {movie.TenPhim || movie.title}
                            </span>
                            <span className="text-slate-400 text-[11px] mt-0.5">
                              {movie.ThoiLuong ? `${movie.ThoiLuong} phút` : ''} {movie.TheLoai ? `• ${movie.TheLoai}` : ''}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* No results prompt */}
              {searchQuery && !isSearching && searchResults.length === 0 && (
                <div className="absolute top-full right-0 lg:left-0 mt-2 w-80 bg-[#131A2A] border border-white/10 rounded-2xl p-4 text-xs text-slate-400 text-center shadow-2xl z-50">
                  Không tìm thấy phim phù hợp với &quot;{searchQuery}&quot;
                </div>
              )}
            </div>

            {/* Ticket History Quick Link */}
            <button
              onClick={handleTicketHistoryClick}
              className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 text-slate-300 hover:text-white transition-all text-xs font-semibold cursor-pointer"
              title="Xem lịch sử mua vé của bạn"
            >
              <Ticket className="w-4 h-4 text-[#FFB000]" />
              <span className="whitespace-nowrap">Lịch sử đặt vé</span>
            </button>

            {/* USER ACCOUNT / LOGIN BUTTON */}
            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff436e] to-[#FFB000] flex items-center justify-center font-bold text-xs text-white shadow-md">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-xs font-bold truncate max-w-[100px] hidden sm:inline-block">
                    {userName || "Tài khoản"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#131A2A] border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 py-1 animate-in zoom-in duration-200">
                    <div className="px-4 py-3 border-b border-white/8">
                      <p className="text-xs text-slate-400">Đăng nhập với</p>
                      <p className="text-xs font-bold text-white truncate mt-0.5">{userName}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <User className="w-4 h-4 text-[#FFB000]" />
                      Tài khoản
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/8 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-[#ff436e]" />
                      Lịch sử đặt vé
                    </Link>

                    <div className="border-t border-white/8 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button className="btn-primary text-xs px-5 py-2.5">
                  Đăng Nhập
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              className="xl:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              title="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>

        {/* MOBILE & TABLET EXPANDABLE MENU */}
        {isMenuOpen && (
          <div className="xl:hidden bg-[#0B1020] border-b border-white/10 px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-300">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm phim, thể loại..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-slate-400 outline-none"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex flex-col gap-3 text-sm font-semibold text-slate-300 pt-2 border-t border-white/5">
              <Link 
                to="/movies/now-showing" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 flex items-center justify-between border-b border-white/5 hover:text-[#FFB000]"
              >
                <span>Phim đang chiếu</span>
                <Film className="w-4 h-4 text-slate-500" />
              </Link>

              <Link 
                to="/movies/coming-soon" 
                onClick={() => setIsMenuOpen(false)}
                className="py-2 flex items-center justify-between border-b border-white/5 hover:text-[#FFB000]"
              >
                <span>Phim sắp chiếu</span>
                <Film className="w-4 h-4 text-slate-500" />
              </Link>

              <button 
                onClick={() => { setIsMenuOpen(false); handleShowtimesClick(); }}
                className="py-2 text-left border-b border-white/5 hover:text-[#FFB000] cursor-pointer"
              >
                Lịch chiếu
              </button>

              <button 
                onClick={() => { setIsMenuOpen(false); setModalType('PRICE_RULES'); }}
                className="py-2 text-left border-b border-white/5 hover:text-[#FFB000] cursor-pointer"
              >
                Giá vé & Quy định
              </button>

              <button 
                onClick={() => { setIsMenuOpen(false); setModalType('CINEMA_INTRO'); }}
                className="py-2 text-left border-b border-white/5 hover:text-[#FFB000] cursor-pointer"
              >
                Giới thiệu rạp
              </button>

              <button 
                onClick={() => { setIsMenuOpen(false); handleTicketHistoryClick(); }}
                className="py-2 flex items-center justify-between hover:text-[#FFB000] cursor-pointer text-[#FFB000]"
              >
                <span>Lịch sử đặt vé</span>
                <Ticket className="w-4 h-4" />
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Spacer to prevent header overlay on page content */}
      <div className="h-20"></div>

      {/* Information Modal */}
      <InfoModal 
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        modalType={modalType}
      />
    </>
  );
};

export default Navbar;