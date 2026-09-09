import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ShieldCheck, Ticket } from 'lucide-react';
import InfoModal from './Common/InfoModal';

const Footer = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  const isLoggedIn = token && role === "CUSTOMER";

  const handleTicketCheck = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } });
    }
  };

  return (
    <>
      <footer className="w-full bg-[#0B1020] border-t border-white/8 pt-16 pb-8 px-4 sm:px-6 lg:px-8 mt-24 text-slate-300">
        <div className="max-w-7xl mx-auto">

          {/* MAIN 4-COLUMN GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">

            {/* COLUMN 1: NexCinema Brand & Social */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 group inline-flex">
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#00c6ff] via-[#7C3AED] to-[#ff436e] p-[1.5px] shadow-lg shadow-[#ff436e]/20 group-hover:scale-105 transition-all">
                  <div className="w-full h-full bg-[#0B1020] rounded-[10.5px] flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 4V20L12 12L4 4Z" fill="url(#ftNexGrad1)" />
                      <path d="M20 20V4L12 12L20 20Z" fill="url(#ftNexGrad2)" />
                      <defs>
                        <linearGradient id="ftNexGrad1" x1="4" y1="4" x2="12" y2="20" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#00c6ff" />
                          <stop offset="1" stopColor="#7C3AED" />
                        </linearGradient>
                        <linearGradient id="ftNexGrad2" x1="20" y1="20" x2="12" y2="4" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#ff436e" />
                          <stop offset="1" stopColor="#FFB000" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <span className="text-xl font-black font-display tracking-tight text-white">
                  Nex<span className="text-[#ff436e]">Cinema</span>
                </span>
              </Link>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Hệ thống rạp chiếu phim với trải nghiệm điện ảnh hiện đại, chất lượng hình ảnh và âm thanh cao cấp.
              </p>

              {/* Social Media Links */}
              <div className="flex items-center gap-3 pt-2">
                {/* Facebook */}
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
                  title="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-[#ff436e] transition-all cursor-pointer"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-white/20 flex items-center justify-center text-slate-400 hover:text-[#FFB000] transition-all cursor-pointer"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* COLUMN 2: Địa điểm & Giờ mở cửa */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider font-display">
                Địa điểm & Giờ mở cửa
              </h3>
              <ul className="space-y-3 text-xs text-slate-400">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#ff436e] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Tầng 4, TTTM NexCenter, 182 Lê Duẩn, Q.1, TP. HCM
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#FFB000] shrink-0" />
                  <span>8:00 – 24:00 (Tất cả các ngày trong tuần)</span>
                </li>
              </ul>
            </div>

            {/* COLUMN 3: Hỗ trợ khách hàng */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider font-display">
                Hỗ trợ khách hàng
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-[#FFB000]" />
                  <span>Hotline: <strong className="text-white font-semibold">1900 8888</strong></span>
                </li>
                <li className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-[#ff436e]" />
                  <span>support@nexcinema.vn</span>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType('SUPPORT_POLICY')}
                    className="hover:text-white transition-colors text-left flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Quy chế bảo vệ dữ liệu</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType('TERMS_PRIVACY')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    FAQ / Hỗ trợ
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 4: Thông tin hữu ích */}
            <div className="space-y-4">
              <h3 className="text-white font-bold text-xs uppercase tracking-wider font-display">
                Thông tin hữu ích
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <button 
                    onClick={() => setModalType('PRICE_RULES')}
                    className="hover:text-[#FFB000] transition-colors text-left cursor-pointer"
                  >
                    Bảng giá vé tiêu chuẩn
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType('AGE_RATING')}
                    className="hover:text-[#FFB000] transition-colors text-left cursor-pointer"
                  >
                    Quy định phân loại độ tuổi
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setModalType('TECH_EXP')}
                    className="hover:text-[#FFB000] transition-colors text-left cursor-pointer"
                  >
                    Trải nghiệm công nghệ IMAX & Atmos
                  </button>
                </li>
                <li>
                  <button 
                    onClick={handleTicketCheck}
                    className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-[#FFB000]"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    <span>Tra cứu vé đã mua</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* BOTTOM COPYRIGHT & LEGAL LINKS */}
          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
            <p>© 2026 NexCinema Vietnam. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setModalType('TERMS_PRIVACY')} 
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Điều khoản sử dụng
              </button>
              <button 
                onClick={() => setModalType('TERMS_PRIVACY')} 
                className="hover:text-slate-300 transition-colors cursor-pointer"
              >
                Chính sách bảo mật
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Info modal */}
      <InfoModal 
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        modalType={modalType}
      />
    </>
  );
};

export default Footer;