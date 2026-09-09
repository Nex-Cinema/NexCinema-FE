import React from 'react';
import { X, Tag, ShieldCheck, Film, Info, FileText, CheckCircle2 } from 'lucide-react';

export type ModalType = 'PRICE_RULES' | 'CINEMA_INTRO' | 'AGE_RATING' | 'TECH_EXP' | 'SUPPORT_POLICY' | 'TERMS_PRIVACY' | null;

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, modalType }) => {
  if (!isOpen || !modalType) return null;

  const getContent = () => {
    switch (modalType) {
      case 'PRICE_RULES':
        return {
          title: 'Giá vé & Quy định',
          icon: <Tag className="w-5 h-5 text-[#991B1B]" />,
          content: (
            <div className="space-y-5 text-gray-700 text-sm">
              <p className="leading-relaxed">
                NexCinema cam kết mang đến mức giá vé minh bạch, hợp lý cùng nhiều ưu đãi hấp dẫn dành cho khán giả yêu điện ảnh.
              </p>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-100 text-gray-800 border-b border-gray-200 uppercase text-[11px] font-bold">
                    <tr>
                      <th className="py-3 px-4">Loại Ghế</th>
                      <th className="py-3 px-4">Thứ 2 - Thứ 5</th>
                      <th className="py-3 px-4">Thứ 6 - CN & Lễ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-medium">
                    <tr className="hover:bg-gray-100/60">
                      <td className="py-3 px-4 text-gray-900 font-semibold">Ghế Thường</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">75.000 ₫</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">90.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-gray-100/60">
                      <td className="py-3 px-4 text-gray-900 font-semibold">Ghế VIP</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">95.000 ₫</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">110.000 ₫</td>
                    </tr>
                    <tr className="hover:bg-gray-100/60">
                      <td className="py-3 px-4 text-gray-900 font-semibold">Ghế Đôi (Sweetbox)</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">180.000 ₫</td>
                      <td className="py-3 px-4 text-[#991B1B] font-bold">210.000 ₫</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 text-xs text-gray-600 bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="flex items-center gap-2 text-amber-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-amber-700" /> Phụ thu định dạng special:
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
          icon: <Film className="w-5 h-5 text-[#991B1B]" />,
          content: (
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <p>
                <strong className="text-gray-900">NexCinema</strong> là hệ thống rạp chiếu phim chuẩn quốc tế với trải nghiệm điện ảnh chân thực, công nghệ chiếu hiện đại và âm thanh sống động.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <h4 className="text-[#991B1B] font-bold text-xs uppercase tracking-wider">Hệ Thống Phòng Chiếu</h4>
                  <p className="text-xs text-gray-600">8 phòng chiếu hiện đại trang bị màn hình cực đại 4K HDR và ghế bọc da cao cấp.</p>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                  <h4 className="text-[#991B1B] font-bold text-xs uppercase tracking-wider">Âm Thanh Chân Thực</h4>
                  <p className="text-xs text-gray-600">Công nghệ Dolby Atmos đa chiều mang lại trải nghiệm điện ảnh sống động từng khoảnh khắc.</p>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Địa chỉ: Tầng 4, TTTM NexCenter, 182 Lê Duẩn, Q.1, TP.HCM • Giờ mở cửa: 8:00 – 24:00 (Tất cả các ngày trong tuần).
              </p>
            </div>
          )
        };

      case 'AGE_RATING':
        return {
          title: 'Quy Định Phân Loại Độ Tuổi',
          icon: <ShieldCheck className="w-5 h-5 text-[#991B1B]" />,
          content: (
            <div className="space-y-3 text-gray-700 text-sm">
              <p className="text-xs text-gray-500">
                Theo quy định của Bộ Văn hóa, Thể thao và Du lịch, NexCinema áp dụng hệ thống phân loại độ tuổi xem phim:
              </p>
              <div className="space-y-2.5">
                <div className="flex gap-3 items-start p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-black text-xs shrink-0">P</span>
                  <div className="text-xs">
                    <strong className="text-emerald-900 block font-bold">Phim phổ biến</strong>
                    <p className="text-gray-600 mt-0.5">Phù hợp cho mọi lứa tuổi khán giả.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-black text-xs shrink-0">K</span>
                  <div className="text-xs">
                    <strong className="text-blue-900 block font-bold">Khán giả dưới 13 tuổi xem cùng cha mẹ</strong>
                    <p className="text-gray-600 mt-0.5">Phổ biến đến khán giả dưới 13 tuổi với điều kiện xem cùng cha mẹ hoặc người giám hộ.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white font-black text-xs shrink-0">T13</span>
                  <div className="text-xs">
                    <strong className="text-amber-900 block font-bold">Phim từ đủ 13 tuổi trở lên</strong>
                    <p className="text-gray-600 mt-0.5">Khán giả chưa đủ 13 tuổi không được phép vào xem phim.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-orange-50 border border-orange-200">
                  <span className="px-2.5 py-0.5 rounded bg-orange-600 text-white font-black text-xs shrink-0">T16</span>
                  <div className="text-xs">
                    <strong className="text-orange-900 block font-bold">Phim từ đủ 16 tuổi trở lên</strong>
                    <p className="text-gray-600 mt-0.5">Khán giả chưa đủ 16 tuổi không được phép vào xem phim.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start p-3 rounded-xl bg-red-50 border border-red-200">
                  <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-black text-xs shrink-0">T18</span>
                  <div className="text-xs">
                    <strong className="text-red-900 block font-bold">Phim từ đủ 18 tuổi trở lên</strong>
                    <p className="text-gray-600 mt-0.5">Phim cấm khán giả dưới 18 tuổi. Vui lòng xuất trình Giấy tờ tùy thân tại quầy rạp.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        };

      case 'TECH_EXP':
        return {
          title: 'Trải Nghiệm Công Nghệ IMAX & Atmos',
          icon: <Info className="w-5 h-5 text-[#991B1B]" />,
          content: (
            <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <h4 className="text-gray-900 font-bold text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#991B1B] text-white font-black text-xs">IMAX</span>
                  Công Nghệ Chiếu IMAX Laser 4K
                </h4>
                <p className="text-xs text-gray-600">
                  Đem lại độ sáng vượt trội, màu sắc chân thực và độ nét kinh ngạc trên màn hình uốn cong siêu lớn phủ kín tầm nhìn.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                <h4 className="text-gray-900 font-bold text-sm flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-gray-900 text-white font-black text-xs">DOLBY ATMOS</span>
                  Âm Thanh Vòm Đa Chiều
                </h4>
                <p className="text-xs text-gray-600">
                  Hệ thống loa trần và loa xung quanh di chuyển âm thanh chính xác theo từng chuyển động trong phim, giúp bạn hòa mình hoàn toàn vào câu chuyện.
                </p>
              </div>
            </div>
          )
        };

      case 'SUPPORT_POLICY':
      case 'TERMS_PRIVACY':
      default:
        return {
          title: 'Điều Khoản & Bảo Mật',
          icon: <FileText className="w-5 h-5 text-[#991B1B]" />,
          content: (
            <div className="space-y-4 text-gray-700 text-xs sm:text-sm leading-relaxed">
              <p>
                NexCinema tôn trọng và cam kết bảo vệ thông tin cá nhân của Quý khách hàng. Dữ liệu tài khoản, lịch sử đặt vé và thanh toán trực tuyến đều được bảo vệ nghiêm ngặt.
              </p>
              <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-600">
                <strong className="text-gray-900 font-bold block">Quy chế giao dịch:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Thanh toán trực tuyến an toàn qua cổng thanh toán VNPay và PayOS.</li>
                  <li>Vé xem phim sau khi đặt thành công sẽ hiển thị mã QR tại lịch sử đặt vé.</li>
                  <li>Mọi thông tin hỗ trợ xin vui lòng liên hệ hotline 1900 8888 hoặc email support@nexcinema.vn.</li>
                </ul>
              </div>
            </div>
          )
        };
    }
  };

  const { title, icon, content } = getContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in duration-200 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            {icon}
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wide">
              {title}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[65vh] overflow-y-auto pr-1">
          {content}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
