import AdminTable from '../Common/AdminTable';
import { AdminPersonCell } from '../Common/AdminEntityCell';
import { Edit2, UserX, UserCheck } from 'lucide-react';

const PersonnelTable = ({ staff, onEdit, onToggleStatus }) => {
  const columns = [
    {
      header: 'Nhân viên',
      render: (person) => <AdminPersonCell name={person.HoTen} email={person.Email} />,
    },
    { header: 'Số điện thoại', accessor: 'SoDienThoai', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Ngày sinh', accessor: 'NgaySinh', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Giới tính', render: (p) => <span className="text-sm text-slate-400">{p.GioiTinh === 1 ? 'Nam' : 'Nữ'}</span> },
    { header: 'Chức vụ', accessor: 'ChucVu', className: 'text-sm text-slate-400 font-medium' },

    {
      header: 'Trạng thái',
      render: (person) => (
        person.KhaDung === 1 ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)] shrink-0" />
            Khả dụng
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border border-red-500/20 bg-red-500/10 text-red-400 uppercase tracking-wider select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)] shrink-0" />
            Đã Khóa
          </span>
        )
      ),
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (person) => (
        <div className="flex justify-end gap-1.5">
          <button onClick={() => onEdit(person)} className="admin-table-action" title="Sửa" aria-label={`Sửa ${person.HoTen}`}>
            <Edit2 size={16} />
          </button>
          <button onClick={() => onToggleStatus(person)}
            className={`admin-table-action ${person.KhaDung === 1 ? 'admin-table-action--danger' : ''}`}
            title={person.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'}
            aria-label={`${person.KhaDung === 1 ? 'Vô hiệu hóa' : 'Kích hoạt'} ${person.HoTen}`}
          >
            {person.KhaDung === 1 ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        </div>
      ),
    },
  ];

  return <AdminTable columns={columns} data={staff} rowKey="MaNhanVien" />;
};

export default PersonnelTable;
