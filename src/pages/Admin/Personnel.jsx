import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import PersonnelTable from '../../components/Admin/Personnel/PersonnelTable';
import PersonnelModal from '../../components/Admin/Personnel/PersonnelModal';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminButton from '../../components/Admin/Common/AdminButton';
import AdminFilterSelect from '../../components/Admin/Common/AdminFilterSelect';
import { AdminEmptyState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import { Plus } from 'lucide-react';

const defaultForm = {
  HoTen: '', SoDienThoai: '', Email: '', ChucVu: '', Role: 'Staff',
  KhaDung: 1, NgaySinh: '', GioiTinh: 1, MatKhau: 'CinemaPlus@2026',
};

const Personnel = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState(defaultForm);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isToggling, setIsToggling] = useState(false);

  const loadStaff = async () => {
    try {
      const data = await adminService.getStaff();
      setStaff(data);
    } catch (err) { showError('Lỗi tải dữ liệu: ' + err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadStaff, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'GioiTinh' || name === 'KhaDung' ? parseInt(value, 10) : value,
    }));
  };

  const openAdd = () => { setEditingStaff(null); setFormData(defaultForm); setIsModalOpen(true); };
  const openEdit = (person) => {
    setEditingStaff(person);
    setFormData({ HoTen: person.HoTen || '', SoDienThoai: person.SoDienThoai || '', Email: person.Email || '', ChucVu: person.ChucVu || '', Role: person.Role || 'Staff', KhaDung: person.KhaDung ?? 1, NgaySinh: person.NgaySinh || '', GioiTinh: person.GioiTinh ?? 1, MatKhau: 'CinemaPlus@2026' });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (person) => {
    setConfirmState({ isOpen: true, data: person });
  };

  const handleConfirmToggle = async () => {
    const person = confirmState.data;
    const newKhaDung = person.KhaDung === 1 ? 0 : 1;
    const actionName = newKhaDung === 0 ? 'Vô hiệu hóa' : 'Kích hoạt';
    setIsToggling(true);
    try {
      await adminService.updateStaff(person.MaNhanVien, { KhaDung: newKhaDung });
      await loadStaff();
      showSuccess(`${actionName} thành công!`);
    } catch (e) {
      showError('Lỗi: ' + e.message);
    } finally {
      setIsToggling(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      if (editingStaff) { await adminService.updateStaff(editingStaff.MaNhanVien, formData); showSuccess('Cập nhật hồ sơ thành công!'); }
      else { await adminService.addStaff(formData); showSuccess('Thêm nhân viên thành công!'); }
      await loadStaff(); setIsModalOpen(false);
    } catch (err) { showError('Lỗi: ' + err.message); }
    finally { setLoading(false); }
  };

  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilterVal,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    paginatedItems
  } = useClientPagination(
    staff,
    ['HoTen', 'Email', 'SoDienThoai', 'ChucVu'],
    (p, f) => {
      const matchRole = !f.role || f.role === 'All' || p.Role === f.role;
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || p.KhaDung === Number(f.activeStatus);
      return matchRole && matchKhaDung;
    }
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý Nhân viên"
        subtitle="Quản lý hồ sơ nhân viên rạp chiếu phim."
        action={
          <AdminButton icon={Plus} onClick={openAdd} className="w-full justify-center md:w-auto">Thêm nhân viên</AdminButton>
        }
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm theo tên, email, số điện thoại hoặc chức vụ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <>
            {/* Role filter */}
            <AdminFilterSelect
              aria-label="Lọc theo vai trò"
              value={filters.role || 'All'}
              onChange={e => setFilterVal('role', e.target.value)}
            >
              <option value="All">Tất cả vai trò</option>
              <option value="Staff">Nhân viên (Staff)</option>
              <option value="Admin">Quản trị viên (Admin)</option>
            </AdminFilterSelect>

            {/* Active Status filter */}
            <AdminFilterSelect
              aria-label="Lọc theo trạng thái"
              value={filters.activeStatus || 'All'}
              onChange={e => setFilterVal('activeStatus', e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value={1}>Khả dụng</option>
              <option value={0}>Đã khóa</option>
            </AdminFilterSelect>
          </>
        }
      />

      {/* Table */}
      {loading && staff.length === 0 ? (
        <AdminLoadingSkeleton rows={5} />
      ) : paginatedItems.length === 0 ? (
        <AdminEmptyState title="Không tìm thấy nhân viên" description="Thử thay đổi từ khóa, vai trò hoặc trạng thái tài khoản." />
      ) : (
        <>
          <PersonnelTable staff={paginatedItems} onEdit={openEdit} onToggleStatus={handleToggleStatus} />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <PersonnelModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        editingStaff={editingStaff} formData={formData}
        onChange={handleInputChange} onSubmit={handleFormSubmit}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.data?.KhaDung === 1 ? "Vô hiệu hóa tài khoản" : "Kích hoạt tài khoản"}
        message={confirmState.data ? `Bạn có chắc chắn muốn ${confirmState.data.KhaDung === 1 ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản nhân viên ${confirmState.data.HoTen}?` : ''}
        confirmText="Xác nhận"
        cancelText="Quay lại"
        variant={confirmState.data?.KhaDung === 1 ? "danger" : "default"}
        isLoading={isToggling}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Personnel;
