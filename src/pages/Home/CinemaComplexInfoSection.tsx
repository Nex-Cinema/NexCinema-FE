import React from 'react';
import { Sparkles, Volume2, Heart, Coffee, MapPin, Phone, Clock } from 'lucide-react';

export const CinemaComplexInfoSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 lg:px-6 pt-12">
      <div className="bg-[#ffffff] rounded-2xl p-6 lg:p-8 shadow-sm border border-[#e4e2e2]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Information & Feature Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#d71920] uppercase tracking-wider">
                Tiêu chuẩn điện ảnh quốc tế
              </span>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1b1c1c] tracking-tight mt-1">
                NexCinema Complex Lê Duẩn
              </h2>
              <p className="text-sm text-[#5f5e5e] mt-2 leading-relaxed">
                Tọa lạc tại vị trí trung tâm 01 Lê Duẩn, Quận 1, TP.HCM, NexCinema mang đến trải nghiệm giải trí điện ảnh đẳng cấp nhất với công nghệ màn chiếu Laser đỉnh cao và âm thanh Atmos.
              </p>
            </div>

            {/* 4 Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#e4e2e2] space-y-2">
                <div className="flex items-center gap-2 text-[#d71920] font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Phòng IMAX Laser</span>
                </div>
                <p className="text-xs text-[#5f5e5e] leading-relaxed">
                  Màn chiếu siêu kích thước cao 15m màn ảnh rộng IMAX Laser thế hệ mới, âm thanh 12 kênh sống động.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#e4e2e2] space-y-2">
                <div className="flex items-center gap-2 text-[#d71920] font-bold text-sm">
                  <Volume2 className="w-4 h-4" />
                  <span>Dolby Atmos Đa Chiều</span>
                </div>
                <p className="text-xs text-[#5f5e5e] leading-relaxed">
                  Hệ thống âm thanh đa chiều vòm 360 độ, đem lại cảm giác như chính bạn đang sống trong từng thước phim.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#e4e2e2] space-y-2">
                <div className="flex items-center gap-2 text-[#d71920] font-bold text-sm">
                  <Heart className="w-4 h-4" />
                  <span>Ghế Đôi Cùng Thời Thượng</span>
                </div>
                <p className="text-xs text-[#5f5e5e] leading-relaxed">
                  Không gian riêng tư, rộng rãi với 1.2m rộng mở, đệm bọc cao cấp mang lại sự thư giãn tuyệt đối cho cặp đôi.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#e4e2e2] space-y-2">
                <div className="flex items-center gap-2 text-[#d71920] font-bold text-sm">
                  <Coffee className="w-4 h-4" />
                  <span>Tiện ích dịch vụ & P2</span>
                </div>
                <p className="text-xs text-[#5f5e5e] leading-relaxed">
                  Không gian chờ sang trọng, khu vệ sinh sạch sẽ, bãi đỗ xe ô tô và xe máy rộng rãi ngay dưới tầng hầm.
                </p>
              </div>
            </div>

            {/* Address & Contact Information */}
            <div className="pt-2 border-t border-[#e4e2e2] space-y-2 text-xs text-[#5f5e5e]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#d71920] shrink-0" />
                <span>Tầng 5, TTTM Diamond Plaza, 34 Lê Duẩn, Phường Bến Nghé, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#d71920] shrink-0" />
                  Hotline: <strong className="text-[#1b1c1c]">1900 8888</strong>
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d71920] shrink-0" />
                  08:00 - 24:00 (Hàng ngày)
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Previews & Map Card */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Main Theater Room Image */}
            <div className="relative rounded-xl overflow-hidden shadow-md aspect-[16/10] bg-[#1b1c1c] group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBG5z6U7cQ2S8F31yV28i5P-m3H5S6M4X4V6M-4Z4Y4V6M-4Z4Y4V6M"
                alt="4K IMAX Laser Hall at NexCinema Lê Duẩn"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  // Fallback high quality cinema hall image if google link fails
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-white text-xs font-semibold bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20">
                  Phòng chiếu IMAX Laser đỉnh cao tại NexCinema Lê Duẩn
                </span>
              </div>
            </div>

            {/* Location Map Preview Card */}
            <div className="relative rounded-xl overflow-hidden border border-[#e4e2e2] bg-[#f5f3f3] p-4 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#1b1c1c] block">Đến NexCinema Lê Duẩn</span>
                <p className="text-[11px] text-[#5f5e5e]">01 Lê Duẩn, Bến Nghé, Quận 1, TP.HCM</p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#d71920] hover:underline pt-1"
                >
                  <MapPin className="w-3.5 h-3.5" /> Xem bản đồ & chỉ đường
                </a>
              </div>
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#e4e2e2] shrink-0 bg-[#e2dfde] flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#d71920]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinemaComplexInfoSection;
