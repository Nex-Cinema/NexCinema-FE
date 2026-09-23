import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidthClass = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-150 ${maxWidthClass}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Đóng modal"
        >
          <X className="w-5 h-5" />
        </button>

        {title && (
          <div className="border-b pb-2">
            {typeof title === 'string' ? (
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            ) : (
              title
            )}
          </div>
        )}

        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
