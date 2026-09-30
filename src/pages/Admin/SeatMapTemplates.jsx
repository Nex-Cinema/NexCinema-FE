import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminTable from '../../components/Admin/Common/AdminTable';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { Plus, Eye, Trash2, Edit2 } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminButton from '../../components/Admin/Common/AdminButton';
import { AdminEmptyState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import SeatMapPreviewModal from '../../components/Admin/SeatMaps/SeatMapPreviewModal';
import SeatMapTemplateModal from '../../components/Admin/SeatMaps/SeatMapTemplateModal';
import AdminFilterSelect from '../../components/Admin/Common/AdminFilterSelect';
import { getSeatMapStats, parseSeatMapStructure } from '../../utils/seatMapHelper';

const SeatMapTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = {
    TenSoDo: '',
    TongHang: 10,
    TongCot: 12,
    CauTruc: '{"aisles": {"rows": [], "cols": [4, 9]}}',
    KhaDung: 1
  };

  const loadData = async () => {
    setLoading(true);
    const data = await adminService.getSeatMaps();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const data = await adminService.getSeatMaps();
      if (!ignore) {
        setTemplates(data);
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    errors,
    isSubmitting
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    try {
      if (editingTemplate) {
        await adminService.updateSeatMap(editingTemplate.MaSoDoGhe, {
          TenSoDo: data.TenSoDo,
          TongHang: Number(data.TongHang),
          TongCot: Number(data.TongCot),
          CauTruc: data.CauTruc,
          KhaDung: data.KhaDung === true || data.KhaDung === 1 || data.KhaDung === '1'
        });
        showSuccess("Cập nhật sơ đồ mẫu thành công!");
      } else {
        await adminService.addSeatMap({
          TenSoDo: data.TenSoDo,
          TongHang: Number(data.TongHang),
          TongCot: Number(data.TongCot),
          CauTruc: data.CauTruc
        });
        showSuccess("Tạo sơ đồ mẫu mới thành công!");
      }
      await loadData();
      setIsModalOpen(false);
      setEditingTemplate(null);
      resetForm();
    } catch (err) {
      showError(`Lỗi: ${err.message}`);
    }
  });

  const handleOpenAddModal = () => {
    setEditingTemplate(null);
    setFormData(initialFormState);
    setIsModalOpen(true);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      TenSoDo: template.TenSoDo,
      TongHang: template.TongHang,
      TongCot: template.TongCot,
      CauTruc: template.CauTruc,
      KhaDung: template.KhaDung === true || template.KhaDung === 1 || template.KhaDung === '1' ? 1 : 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmState({ isOpen: true, data: id });
  };

  const handleConfirmDelete = async () => {
    const id = confirmState.data;
    setIsDeleting(true);
    try {
      await adminService.deleteSeatMap(id);
      showSuccess("Xóa sơ đồ mẫu thành công!");
      await loadData();
    } catch (err) {
      showError(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
    }
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
    templates,
    ['TenSoDo', 'MaSoDoGhe'],
    (t, f) => {
      const normalizedStatus = t.KhaDung === true || t.KhaDung === 1 || t.KhaDung === '1' ? 1 : 0;
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || normalizedStatus === Number(f.activeStatus);
      return matchKhaDung;
    }
  );

  const columns = [
    { header: 'Tên sơ đồ', accessor: 'TenSoDo', className: 'text-slate-400' },
    { header: 'Số hàng', accessor: 'TongHang', className: 'text-slate-400' },
    { header: 'Số cột', accessor: 'TongCot', className: 'text-slate-400' },
    { 
      header: 'Tổng số ghế', 
      render: (t) => {
        try {
          const stats = getSeatMapStats(Number(t.TongHang), Number(t.TongCot), parseSeatMapStructure(t.CauTruc));
          return <span className="font-bold text-emerald-500">{stats.units} ghế · {stats.capacity} chỗ</span>;
        } catch { return <span className="text-slate-500">Chưa xác định</span>; }
      }
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (t) => (
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => setPreviewTemplate(t)}
            className="admin-table-action"
            title="Xem trước"
            aria-label={`Xem trước ${t.TenSoDo}`}
          >
            <Eye size={16} />
          </button>
          <button 
            onClick={() => handleEdit(t)}
            className="admin-table-action"
            title="Sửa"
            aria-label={`Sửa ${t.TenSoDo}`}
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={() => handleDelete(t.MaSoDoGhe)}
            className="admin-table-action admin-table-action--danger"
            title="Xóa"
            aria-label={`Xóa ${t.TenSoDo}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Sơ đồ ghế mẫu"
        subtitle="Quản lý các khuôn mẫu sơ đồ ghế (Template) dùng khi tạo phòng chiếu."
        action={
          <AdminButton icon={Plus} onClick={handleOpenAddModal} className="w-full justify-center md:w-auto">Tạo mẫu mới</AdminButton>
        }
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm theo tên sơ đồ hoặc mã sơ đồ..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <>
            {/* Active Status filter */}
            <AdminFilterSelect
              aria-label="Lọc theo trạng thái"
              value={filters.activeStatus || 'All'}
              onChange={e => setFilterVal('activeStatus', e.target.value)}
            >
              <option value="All">Tất cả trạng thái</option>
              <option value={1}>Khả dụng</option>
              <option value={0}>Không khả dụng</option>
            </AdminFilterSelect>
          </>
        }
      />

      {loading ? (
        <AdminLoadingSkeleton rows={5} />
      ) : paginatedItems.length === 0 ? (
        <AdminEmptyState
          title="Không tìm thấy sơ đồ ghế"
          description="Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả."
        />
      ) : (
        <>
          <AdminTable columns={columns} data={paginatedItems} rowKey="MaSoDoGhe" showDetailAction={false} />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <SeatMapTemplateModal
        key={`${editingTemplate?.MaSoDoGhe || 'new'}-${isModalOpen}`}
        isOpen={isModalOpen}
        editingTemplate={editingTemplate}
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTemplate(null);
        }}
        isSubmitting={isSubmitting}
        errors={errors}
      />

      <SeatMapPreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa sơ đồ mẫu"
        message={`Bạn có chắc chắn muốn xóa sơ đồ mẫu ${confirmState.data}?`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default SeatMapTemplates;
