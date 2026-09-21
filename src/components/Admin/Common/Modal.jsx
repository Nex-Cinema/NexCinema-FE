
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, description, children, footer, size = 'default', bodyClassName = '' }) => {
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div className="admin-modal-layer" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" className="admin-modal-backdrop" onClick={onClose} aria-label="Đóng hộp thoại" />
      <div className="admin-modal-panel" data-size={size}>
        <div className="admin-modal-header">
          <div>
            <h3>{title}</h3>
            {description && <p>{description}</p>}
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="admin-icon-button"
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={20} />
          </button>
        </div>
        <div className={`admin-modal-body ${bodyClassName}`}>{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
