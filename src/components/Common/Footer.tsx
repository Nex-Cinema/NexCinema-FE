import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Mail, ShieldCheck, Globe, MessageSquare } from 'lucide-react';
import InfoModal, { ModalType } from './InfoModal';
import UITLogo from '@/assets/LogoUIT2.jpg';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const [modalType, setModalType] = useState<ModalType>(null);

  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");
  const isLoggedIn = Boolean(token && role === "CUSTOMER");

  const handleTicketCheck = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login', { state: { from: '/profile' } });
    }
  };

  return (
    <>
      <footer className="w-full bg-white border-t border-gray-200 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-gray-600 font-sans">
        <div className="max-w-[1280px] mx-auto">

          {/* 4 COLUMNS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 text-left">

            {/* COLUMN 1 */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-3 shrink-0 inline-flex">
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

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-xs">
                Hệ thống rạp chiếu phim chuẩn quốc tế với trải nghiệm điện ảnh chân thực, công nghệ chiếu hiện đại và âm thanh sống động.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-4 pt-2">
                <a href="https://nexcinema.vn" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#d71920] transition-colors" title="Website">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#d71920] transition-colors" title="YouTube">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[#d71920] transition-colors" title="Message">
                  <MessageSquare className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-3.5">
              <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide font-display">
                Địa điểm & Giờ mở cửa
              </h3>
              <ul className="space-y-3 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    Tầng 4, TTTM NexCenter, 182 Lê Duẩn, Q.1, TP.HCM
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#d71920] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    8:00 – 24:00 (Tất cả các ngày trong tuần)
                  </span>
                </li>
              </ul>
            </div>

            {/* COLUMN 3 */}
            <div className="space-y-3.5">
              <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide font-display">
                Hỗ trợ khách hàng
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-gray-600">
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#d71920] shrink-0" />
                  <span>Hotline: <strong className="text-gray-900 font-bold">1900 8888</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#d71920] shrink-0" />
                  <a href="mailto:support@nexcinema.vn" className="hover:text-[#d71920] transition-colors">
                    support@nexcinema.vn
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#d71920] shrink-0" />
                  <button onClick={() => setModalType('SUPPORT_POLICY')} className="hover:text-[#d71920] transition-colors text-left cursor-pointer">
                    Quy chế bảo vệ dữ liệu
                  </button>
                </li>
              </ul>
            </div>

            {/* COLUMN 4 */}
            <div className="space-y-3.5">
              <h3 className="text-gray-900 font-bold text-sm uppercase tracking-wide font-display">
                Thông tin hữu ích
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li>
                  <button onClick={() => setModalType('PRICE_RULES')} className="hover:text-[#d71920] transition-colors text-left cursor-pointer">
                    Bảng giá vé tiêu chuẩn
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType('AGE_RATING')} className="hover:text-[#d71920] transition-colors text-left cursor-pointer">
                    Quy định phân loại độ tuổi
                  </button>
                </li>
                <li>
                  <button onClick={() => setModalType('TECH_EXP')} className="hover:text-[#d71920] transition-colors text-left cursor-pointer">
                    Trải nghiệm công nghệ IMAX & Atmos
                  </button>
                </li>
                <li>
                  <button onClick={handleTicketCheck} className="hover:text-[#d71920] transition-colors text-left cursor-pointer">
                    Tra cứu vé đã mua
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* BOTTOM BAR */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-medium">
            <p>© 2024 NexCinema Vietnam. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-6">
              <button onClick={() => setModalType('TERMS_PRIVACY')} className="hover:text-gray-900 transition-colors cursor-pointer">
                Điều khoản sử dụng
              </button>
              <button onClick={() => setModalType('TERMS_PRIVACY')} className="hover:text-gray-900 transition-colors cursor-pointer">
                Chính sách bảo mật
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Info Modal */}
      <InfoModal 
        isOpen={Boolean(modalType)}
        onClose={() => setModalType(null)}
        modalType={modalType}
      />
    </>
  );
};

export default Footer;
