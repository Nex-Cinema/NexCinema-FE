import React from 'react';
import { LogOut } from 'lucide-react';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in duration-150 border border-gray-200"
      >
        <div className="w-14 h-14 mx-auto rounded-full bg-red-50 text-[#d71920] flex items-center justify-center mb-4 border border-red-100">
          <LogOut className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-[#1b1c1c]">Đăng xuất tài khoản?</h3>
        <p className="text-xs text-[#5f5e5e] mt-1 leading-relaxed">
          Bạn sẽ cần đăng nhập lại để xem lịch sử vé và thông tin cá nhân của bạn.
        </p>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={onClose}
            className="py-2.5 rounded-xl bg-[#f5f3f3] hover:bg-gray-200 text-[#1b1c1c] font-bold text-xs transition-colors cursor-pointer"
          >
            Ở lại
          </button>
          <button
            onClick={onConfirm}
            className="py-2.5 rounded-xl bg-[#d71920] hover:bg-[#ae0011] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};
