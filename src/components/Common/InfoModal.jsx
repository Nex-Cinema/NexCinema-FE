import { X, Tag, ShieldCheck, Film, Info, FileText, CheckCircle2 } from 'lucide-react';

const InfoModal = ({ isOpen, onClose, modalType }) => {
  if (!isOpen || !modalType) return null;

  const getContent = () => {
    switch (modalType) {
      case 'PRICE_RULES':
        return {
          title: 'Giá vé & Quy định',
          icon: <Tag className="w-6 h-6 text-[#FFB000]" />,
          content: (
            <div className="space-y-6 text-slate-300 text-sm">
              <p className="leading-relaxed">
                NexCinema cam kết mang đến mức giá vé minh bạch, hợp lý cùng nhiều ưu đãi hấp dẫn dành cho khán giả yêu điện ảnh.
              </p>

              {/* Pricing Table */}
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-[#1B2435] text-slate-200 border-b border-white/10 uppercase text-[11px] tracking-wider font-bold">
                    <tr>
                      <th className="py-3 px-4">Loại Ghế</th>
                      <th className="py-3 px-4">Thứ 2 - Thứ 5</th>
                      <th className="py-3 px-4">Thứ 6 - CN & Lễ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-semibold">Ghế Thường</td>
                      <td className="py-3 px-4 text-[#FFB000]">75.000 ₫</td>
                      <td className="py-3 px-4 text-[#FFB000]">90.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-semibold">Ghế VIP</td>
                      <td className="py-3 px-4 text-[#FFB000]">95.000 ₫</td>
                      <td className="py-3 px-4 text-[#FFB000]">110.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-white/5">
                      <td className="py-3 px-4 text-white font-semibold">Ghế Đôi (Sweetbox)</td>
                      <td className="py-3 px-4 text-[#FFB000]">180.000 ₫</td>
                      <td className="py-3 px-4 text-[#FFB000]">210.000 ₫</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Extra Info */}
              <div className="space-y-2 text-xs text-slate-400 bg-white/4 p-4 rounded-xl border border-white/5">
                <p className="flex items-center gap-2 text-slate-200 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-[#FFB000]" /> Phụ thu định dạng special:
                </p>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li>Suất chiếu IMAX 3D: Phụ thu 30.000 ₫ / vé.</li>
                  <li>Suất chiếu 3D tiêu chuẩn: Phụ thu 15.000 ₫ / vé.</li>
                  <li>Vé xem phim đã mua trực tuyến không hỗ trợ hoàn tiền sau khi giao dịch hoàn tất.</li>
                </ul>
              </div>
            </div>
          )
        };

      case 'CINEMA_INTRO':
        return {
          title: 'Giới Thiệu Rạp NexCinema',
          icon: <Film className="w-6 h-6 text-[#ff436e]" />,
          content: (
            <div className="space-y-5 text-slate-300 text-sm leading-relaxed">
              <p>
                <strong className="text-white">NexCinema</strong> là tổ hợp rạp chiếu phim hiện đại chuẩn quốc tế, tọa lạc tại vị trí trung tâm sầm uất TTTM NexCenter (Tầng 4, 182 Lê Duẩn, Q.1, TP. HCM).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-1">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#FFB000]">Hệ Thống Phòng Chiếu</h4>
                  <p className="text-xs text-slate-400">8 phòng chiếu hiện đại trang bị màn hình cực đại 4K HDR và ghế ngồi bọc da cao cấp.</p>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-1">
                  <h4 className="text-white font-bold text-xs uppercase tracking-wider text-[#ff436e]">Âm Thanh Chân Thực</h4>
                  <p className="text-xs text-slate-400">Công nghệ Dolby Atmos đa chiều mang lại trải nghiệm điện ảnh sống động từng khoảnh khắc.</p>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Với khẩu hiệu &quot;Đỉnh Cao Điện Ảnh Trong Tầm Tay&quot;, NexCinema luôn nỗ lực không ngừng để nâng tầm trải nghiệm giải trí của Quý khán giả.
              </p>
            </div>
          )
        };

      case 'AGE_RATING':
        return {
          title: 'Quy Định Phân Loại Độ Tuổi',
          icon: <ShieldCheck className="w-6 h-6 text-[#FFB000]" />,
          content: (
            <div className="space-y-4 text-slate-300 text-sm">
              <p className="text-xs text-slate-400">
                Theo quy định của Bộ Văn hóa, Thể thao và Du lịch, NexCinema áp dụng hệ thống phân loại phim nghiêm ngặt:
              </p>
              <div className="space-y-3">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-black text-xs shrink-0">P</span>
                  <div className="text-xs">
                    <strong className="text-emerald-400 block font-bold">Phim phổ biến</strong>
                    <p className="text-slate-300 mt-0.5">Phim phù hợp cho mọi lứa tuổi khán giả.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="px-2.5 py-1 rounded bg-blue-500 text-white font-black text-xs shrink-0">K</span>
                  <div className="text-xs">
                    <strong className="text-blue-400 block font-bold">Dưới 13 tuổi xem cùng cha mẹ</strong>
                    <p className="text-slate-300 mt-0.5">Phim được phép phổ biến đến khán giả dưới 13 tuổi với điều kiện xem cùng cha mẹ hoặc người giám hộ.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-xs shrink-0">T13</span>
                  <div className="text-xs">
                    <strong className="text-amber-400 block font-bold">Phim từ đủ 13 tuổi trở lên</strong>
                    <p className="text-slate-300 mt-0.5">Khán giả chưa đủ 13 tuổi không được phép vào xem phim.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <span className="px-2.5 py-1 rounded bg-orange-500 text-white font-black text-xs shrink-0">T16</span>
                  <div className="text-xs">
                    <strong className="text-orange-400 block font-bold">Phim từ đủ 16 tuổi trở lên</strong>
                    <p className="text-slate-300 mt-0.5">Khán giả chưa đủ 16 tuổi không được phép vào xem phim.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="px-2.5 py-1 rounded bg-rose-600 text-white font-black text-xs shrink-0">T18</span>
                  <div className="text-xs">
                    <strong className="text-rose-400 block font-bold">Phim từ đủ 18 tuổi trở lên</strong>
                    <p className="text-slate-300 mt-0.5">Phim cấm khán giả dưới 18 tuổi. Vui lòng xuất trình CCCD/Giấy tờ tùy thân tại quầy vé.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        };

      case 'TECH_EXP':
        return {
          title: 'Trải Nghiệm Công Nghệ IMAX & Atmos',
          icon: <Info className="w-6 h-6 text-[#ff436e]" />,
          content: (
            <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#FFB000] text-slate-950 font-black text-xs">IMAX</span>
                  Công Nghệ Chiếu IMAX Laser 4K
                </h4>
                <p className="text-xs text-slate-300">
                  Đem lại độ sáng vượt trội, màu sắc chân thực và độ nét kinh ngạc trên màn hình uốn cong siêu lớn phủ kín tầm nhìn.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/8 space-y-2">
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-violet-600 text-white font-black text-xs">DOLBY ATMOS</span>
                  Âm Thanh Vòm Đa Chiều
                </h4>
                <p className="text-xs text-slate-300">
                  Hệ thống loa trần và loa xung quanh di chuyển âm thanh chính xác theo từng chuyển động trong phim, giúp bạn hòa mình hoàn toàn vào câu chuyện.
                </p>
              </div>
            </div>
          )
        };

      case 'TERMS_PRIVACY':
      default:
        return {
          title: 'Điều Khoản & Bảo Mật',
          icon: <FileText className="w-6 h-6 text-[#FFB000]" />,
          content: (
            <div className="space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed">
              <p>
                NexCinema tôn trọng và cam kết bảo vệ thông tin cá nhân của Quý khách hàng. Dữ liệu tài khoản, lịch sử đặt vé và thanh toán trực tuyến đều được mã hóa theo chuẩn an toàn SSL.
              </p>
              <div className="space-y-2 bg-white/5 p-4 rounded-xl border border-white/8">
                <strong className="text-white font-bold block">Nguyên tắc giao dịch:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Vé xem phim sau khi giữ ghế sẽ được lưu giữ tối đa 10 phút để thực hiện thanh toán.</li>
                  <li>Thanh toán trực tuyến an toàn qua hệ thống cổng thanh toán VNPay / PayOS.</li>
                  <li>Thông tin mã QR vé sẽ được lưu tại trang Cá Nhân &gt; Lịch sử đặt vé.</li>
                </ul>
              </div>
            </div>
          )
        };
    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-box max-w-lg w-full animate-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {icon}
            <h3 className="text-lg font-bold text-white font-display uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {content}
        </div>

        {/* Footer button */}
        <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
