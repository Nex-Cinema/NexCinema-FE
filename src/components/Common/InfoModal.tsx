import React from 'react';
import { X, ShieldCheck, Ticket, Info, FileText } from 'lucide-react';

export type ModalType = 'PRICE_RULES' | 'CINEMA_INTRO' | 'TERMS' | 'PRIVACY' | null;

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, modalType }) => {
  if (!isOpen || !modalType) return null;

  const renderContent = () => {
    switch (modalType) {
      case 'PRICE_RULES':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#d71920] font-bold text-lg border-b pb-2">
              <Ticket className="w-5 h-5" />
              <span>Bảng Giá Vé & Quy Định Rạp NexCinema</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 font-bold">
                    <th className="p-2.5 border border-gray-200">Loại Vé</th>
                    <th className="p-2.5 border border-gray-200">Thứ 2 - Thứ 5</th>
                    <th className="p-2.5 border border-gray-200">Thứ 6 - CN & Lễ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-gray-800">
                  <tr>
                    <td className="p-2.5 border border-gray-200 font-semibold">Ghế Thường (2D)</td>
                    <td className="p-2.5 border border-gray-200">75.000 VNĐ</td>
                    <td className="p-2.5 border border-gray-200">95.000 VNĐ</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-gray-200 font-semibold">Ghế VIP (2D)</td>
                    <td className="p-2.5 border border-gray-200">90.000 VNĐ</td>
                    <td className="p-2.5 border border-gray-200">110.000 VNĐ</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-gray-200 font-semibold">Ghế Đôi Sweetbox (2D)</td>
                    <td className="p-2.5 border border-gray-200">190.000 VNĐ/Cặp</td>
                    <td className="p-2.5 border border-gray-200">220.000 VNĐ/Cặp</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-gray-200 font-semibold">Phòng IMAX Laser</td>
                    <td className="p-2.5 border border-gray-200">140.000 VNĐ</td>
                    <td className="p-2.5 border border-gray-200">170.000 VNĐ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-[#f5f3f3] p-3 rounded-lg text-xs space-y-1.5 text-[#5f5e5e]">
              <p className="font-bold text-[#1b1c1c]">Quy định phân loại nhãn độ tuổi:</p>
              <p>• <strong>P:</strong> Phim phổ biến, phù hợp mọi lứa tuổi.</p>
              <p>• <strong>K:</strong> Phim dành cho người xem dưới 13 tuổi với điều kiện xem cùng cha mẹ hoặc người giám hộ.</p>
              <p>• <strong>C13:</strong> Cấm khán giả dưới 13 tuổi.</p>
              <p>• <strong>C16:</strong> Cấm khán giả dưới 16 tuổi.</p>
              <p>• <strong>C18:</strong> Cấm khán giả dưới 18 tuổi.</p>
            </div>
          </div>
        );

      case 'CINEMA_INTRO':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#d71920] font-bold text-lg border-b pb-2">
              <Info className="w-5 h-5" />
              <span>Giới Thiệu Rạp NexCinema Lê Duẩn</span>
            </div>
            <p className="text-xs text-[#5f5e5e] leading-relaxed">
              NexCinema Lê Duẩn là cụm rạp chiếu phim hiện đại chuẩn quốc tế tọa lạc ngay trung tâm Quận 1, TP.HCM. Rạp sở hữu 6 phòng chiếu tiên tiến với hơn 1.000 ghế ngồi tiêu chuẩn cao cấp, trong đó có phòng chiếu màn hình siêu rộng IMAX Laser đỉnh cao và dàn âm thanh vòm Dolby Atmos đa chiều.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#f5f3f3] rounded-lg border border-gray-200">
                <span className="font-bold text-[#1b1c1c] block">Địa chỉ</span>
                <span className="text-[#5f5e5e]">01 Lê Duẩn, P. Bến Nghé, Q.1, TP.HCM</span>
              </div>
              <div className="p-3 bg-[#f5f3f3] rounded-lg border border-gray-200">
                <span className="font-bold text-[#1b1c1c] block">Giờ mở cửa</span>
                <span className="text-[#5f5e5e]">08:00 - 24:00 (Hàng ngày)</span>
              </div>
            </div>
          </div>
        );

      case 'TERMS':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#d71920] font-bold text-lg border-b pb-2">
              <FileText className="w-5 h-5" />
              <span>Điều Khoản Sử Dụng Service</span>
            </div>
            <div className="text-xs text-[#5f5e5e] space-y-2 leading-relaxed max-h-60 overflow-y-auto pr-2">
              <p className="font-bold text-[#1b1c1c]">1. Đặt vé trực tuyến</p>
              <p>Khách hàng vui lòng kiểm tra kĩ thông tin phim, suất chiếu, phòng chiếu và số ghế trước khi thực hiện thanh toán online qua VNPay hoặc PayOS.</p>
              <p className="font-bold text-[#1b1c1c]">2. Hoàn hủy & Đổi vé</p>
              <p>Vé xem phim đã thanh toán thành công trực tuyến không hỗ trợ đổi hoặc hoàn tiền dưới mọi hình thức, trừ trường hợp xuất phát từ sự cố kỹ thuật rạp.</p>
              <p className="font-bold text-[#1b1c1c]">3. Quy định tại phòng chiếu</p>
              <p>Khách hàng không mang đồ ăn/thức uống ngoài vào rạp. Vui lòng xuất trình giấy tờ tùy thân kiểm tra độ tuổi khi xem phim nhãn C13, C16, C18.</p>
            </div>
          </div>
        );

      case 'PRIVACY':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[#d71920] font-bold text-lg border-b pb-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Chính Sách Bảo Mật Thông Tin</span>
            </div>
            <div className="text-xs text-[#5f5e5e] space-y-2 leading-relaxed max-h-60 overflow-y-auto pr-2">
              <p>NexCinema cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng bao gồm Họ tên, Số điện thoại, Email và Lịch sử giao dịch đặt vé.</p>
              <p>Thông tin thanh toán qua thẻ ngân hàng hoặc ví điện tử được xử lý mã hóa bảo mật bởi các đối tác cổng thanh toán VNPay và PayOS.</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {renderContent()}

        <div className="pt-3 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#d71920] hover:bg-[#ae0011] text-white text-xs font-bold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
