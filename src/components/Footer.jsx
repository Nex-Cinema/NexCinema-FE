import { Clock, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Brand from './Client/Brand';

const Footer = () => (
  <footer className="border-t border-(--client-border) bg-white px-4 py-12 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
      <div>
        <div className="mb-4"><Brand compact /></div>
        <p className="max-w-md text-sm leading-6 text-neutral-500">Đặt vé trực tuyến, chọn ghế trực quan và thanh toán an toàn trong một luồng duy nhất.</p>
      </div>
      <div>
        <h2 className="client-footer-title">Khám phá</h2>
        <div className="flex flex-col gap-3 text-sm text-neutral-500">
          <Link className="client-footer-link" to="/movies/now-showing">Phim đang chiếu</Link>
          <Link className="client-footer-link" to="/movies/coming-soon">Phim sắp chiếu</Link>
          <Link className="client-footer-link" to="/profile">Vé của tôi</Link>
        </div>
      </div>
      <div>
        <h2 className="client-footer-title">Hỗ trợ</h2>
        <ul className="space-y-3 text-sm text-neutral-500">
          <li className="flex items-center gap-2"><Clock size={16} className="text-(--client-secondary)" />08:00 – 24:00 mỗi ngày</li>
          <li className="flex items-center gap-2"><Phone size={16} className="text-(--client-secondary)" />1900 8888</li>
          <li className="flex items-center gap-2"><Mail size={16} className="text-(--client-secondary)" />support@nexcinema.vn</li>
        </ul>
      </div>
    </div>
    <p className="mx-auto mt-10 max-w-7xl border-t border-neutral-200 pt-6 text-xs text-neutral-400">© 2026 NexCinema. Đồ án hệ thống đặt vé xem phim.</p>
  </footer>
);

export default Footer;
