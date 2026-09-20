import { X } from 'lucide-react';

const AdminDateFilter = ({ label = 'Ngày', value, onChange }) => (
  <label className="admin-date-filter">
    <span>{label}</span>
    <input type="date" value={value || ''} onChange={(event) => onChange(event.target.value)} />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label={`Xóa bộ lọc ${label.toLowerCase()}`} title="Xóa ngày">
        <X size={14} aria-hidden="true" />
      </button>
    )}
  </label>
);

export default AdminDateFilter;
