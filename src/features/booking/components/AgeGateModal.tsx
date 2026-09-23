import React from 'react';
import Modal from '@/components/ui/Modal';
import AgeBadge from '@/components/shared/AgeBadge';

interface AgeGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle: string;
  movieAgeRating: string;
  onConfirm: () => void;
}

export const AgeGateModal: React.FC<AgeGateModalProps> = ({
  isOpen,
  onClose,
  movieTitle,
  movieAgeRating,
  onConfirm,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidthClass="max-w-sm"
    >
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <AgeBadge rating={movieAgeRating} className="text-2xl px-4 py-2 rounded-xl" />
        </div>

        <h3 className="text-base font-bold text-[#1b1c1c]">Xác nhận độ tuổi</h3>
        <p className="text-xs text-[#5f5e5e] mt-2 leading-relaxed">
          Phim <span className="font-bold text-[#1b1c1c]">"{movieTitle}"</span> được xếp hạng{' '}
          <span className="font-black text-[#d71920]">{movieAgeRating}</span>.
          {movieAgeRating === 'C18'
            ? ' Chỉ dành cho khán giả từ 18 tuổi trở lên.'
            : movieAgeRating === 'C16'
            ? ' Chỉ dành cho khán giả từ 16 tuổi trở lên.'
            : ' Chỉ dành cho khán giả từ 13 tuổi trở lên.'}
        </p>
        <p className="text-[11px] text-gray-400 mt-2 italic">
          Nhân viên rạp có thể yêu cầu xuất trình CCCD / Căn cước / Hộ chiếu tại cổng soát vé.
        </p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Tôi đủ tuổi, tiếp tục
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AgeGateModal;
