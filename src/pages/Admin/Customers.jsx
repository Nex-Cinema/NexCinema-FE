import { useState, useEffect } from 'react';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import Modal from '../../components/Admin/Common/Modal';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import adminService from '../../services/adminService';
import { UserX, UserCheck, History, X, CheckSquare, AlertTriangle } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminFilterSelect from '../../components/Admin/Common/AdminFilterSelect';
import { AdminPersonCell } from '../../components/Admin/Common/AdminEntityCell';
import { AdminEmptyState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminButton from '../../components/Admin/Common/AdminButton';
import FormField from '../../components/Admin/Common/FormField';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedCust, setSelectedCust] = useState(null);
  const [lockReason, setLockReason] = useState('');

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isUnlocking, setIsUnlocking] = useState(false);

  const loadCustomers = async () => {
    try {
      const data = await adminService.getCustomers();
      setCustomers(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(loadCustomers, 0);
    return () => window.clearTimeout(timeoutId);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleToggleLockStatus = async () => {
    if (!selectedCust || !lockReason.trim()) return;
    try {
      const result = await adminService.lockCustomerAccount(selectedCust.MaKhachHang, lockReason);
      await loadCustomers();
      
      setIsLockModalOpen(false);
      setLockReason('');
      
      showSuccess(
        `KHÓA TÀI KHOẢN THÀNH CÔNG!\n` +
        `1. Cập nhật KhaDung = 0 và LyDoKhoa: "${result.reason}".\n` +
        `2. Đã gửi thư thông báo đến địa chỉ: ${result.email}.`
      );
    } catch (error) {
      showError("Lỗi khi khóa tài khoản: " + error.message);
    }
  };

  const openLockModal = async (cust) => {
    setSelectedCust(cust);
    if (cust.TrangThai === 'Active') {
      setLockReason('');
      setIsLockModalOpen(true);
    } else {
      setConfirmState({ isOpen: true, data: cust });
    }
  };

  const handleConfirmUnlock = async () => {
    const cust = confirmState.data;
    setIsUnlocking(true);
    try {
      await adminService.unlockCustomerAccount(cust.MaKhachHang);
      await loadCustomers();
      showSuccess(`Đã mở khóa tài khoản của ${cust.HoTen} thành công. Trạng thái đã chuyển sang Đang hoạt động.`);
    } catch (error) {
      showError("Lỗi khi mở khóa tài khoản: " + error.message);
    } finally {
      setIsUnlocking(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  const openHistoryDrawer = async (cust) => {
    setSelectedCust(cust);
    setIsHistoryOpen(true);
    setLoadingTransactions(true);
    try {
      const trans = await adminService.getCustomerTransactions(cust.MaKhachHang);
      setTransactions(trans);
    } catch (error) {
      showError("Lỗi tải lịch sử giao dịch: " + error.message);
    } finally {
      setLoadingTransactions(false);
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
    customers,
    ['HoTen', 'Email', 'SoDienThoai'],
    (c, f) => {
      const matchStatus = !f.status || f.status === 'All' || c.TrangThai === f.status;
      return matchStatus;
    }
  );

  const columns = [
    {
      header: 'Khách hàng',
      render: (c) => <AdminPersonCell name={c.HoTen} email={c.Email} />
    },
    { header: 'Số điện thoại', accessor: 'SoDienThoai', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Giới tính', accessor: 'GioiTinh', className: 'text-sm text-slate-400 font-semibold' },
    { header: 'Ngày sinh', accessor: 'NgaySinh', className: 'text-sm text-slate-400 font-mono' },
    { header: 'Ngày đăng ký', accessor: 'NgayTao', className: 'text-sm text-slate-400 font-mono' },
    {
      header: 'Trạng thái',
      render: (c) => <StatusBadge status={c.TrangThai} />
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (c) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openHistoryDrawer(c)}
            className="admin-table-action"
            title="Lịch sử mua vé"
            aria-label={`Xem lịch sử mua vé của ${c.HoTen}`}
          >
            <History size={16} />
          </button>
          <button 
            onClick={() => openLockModal(c)}
            className={`admin-table-action ${c.TrangThai === 'Active' ? 'admin-table-action--danger' : ''}`}
            title={c.TrangThai === 'Active' ? 'Khóa tài khoản' : 'Mở khóa'}
            aria-label={`${c.TrangThai === 'Active' ? 'Khóa' : 'Mở khóa'} tài khoản ${c.HoTen}`}
          >
            {c.TrangThai === 'Active' ? <UserX size={16} /> : <UserCheck size={16} />}
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý khách hàng"
        subtitle="Tra cứu hồ sơ khách hàng, xem lịch sử giao dịch và quản lý khóa/mở tài khoản."
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm kiếm khách hàng theo tên, email, sđt..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <AdminFilterSelect
            aria-label="Lọc khách hàng theo trạng thái"
            value={filters.status || 'All'}
            onChange={e => setFilterVal('status', e.target.value)}
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Active">Đang hoạt động</option>
            <option value="Banned">Bị khóa</option>
          </AdminFilterSelect>
        }
      />

      {/* Table */}
      {loading ? (
        <AdminLoadingSkeleton rows={5} />
      ) : paginatedItems.length === 0 ? (
        <AdminEmptyState title="Không tìm thấy khách hàng" description="Thử thay đổi từ khóa hoặc trạng thái tài khoản." />
      ) : (
        <>
          <AdminTable columns={columns} data={paginatedItems} rowKey="MaKhachHang" />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      {/* Side Drawer: Transaction History */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[150] flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsHistoryOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-white h-screen shadow-2xl border-l border-neutral-200 p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-start justify-between pb-4 mb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Lịch sử đặt vé</h3>
                <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
                  Khách hàng: <strong className="text-neutral-800">{selectedCust?.HoTen}</strong> ({selectedCust?.Email}) | SĐT: {selectedCust?.SoDienThoai} | Giới tính: {selectedCust?.GioiTinh} | Ngày sinh: {selectedCust?.NgaySinh}
                </p>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)} 
                className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                title="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 pr-1">
              {loadingTransactions ? (
                <div className="h-64 flex justify-center items-center text-neutral-500 text-sm">
                  <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-red-600 mr-3"></div>
                  Đang tải giao dịch...
                </div>
              ) : transactions.length === 0 ? (
                <div className="h-64 flex flex-col justify-center items-center text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
                  <CheckSquare size={32} className="mb-2 text-neutral-300" />
                  <span className="text-sm">Chưa có giao dịch nào được thực hiện.</span>
                </div>
              ) : (
                transactions.map((t) => (
                  <div key={t.MaDatVe} className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition-all hover:border-neutral-300 hover:bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-semibold text-red-600 font-mono">{t.MaDatVe}</span>
                        <h4 className="font-semibold text-neutral-900 text-sm mt-0.5">{t.Phim}</h4>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        t.TrangThai === 'Thành công' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}>
                        {t.TrangThai}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs text-neutral-500 mt-3 pt-3 border-t border-neutral-200/60">
                      <div>Ghế: <span className="font-medium text-neutral-800">{t.Ghe}</span></div>
                      <div>Phương thức: <span className="font-medium text-neutral-800">{t.PTThanhToan}</span></div>
                      <div>Ngày đặt: <span className="font-medium text-neutral-800 font-mono">{t.NgayDat}</span></div>
                      <div>Tổng tiền: <span className="font-semibold text-red-600 font-mono">{formatPrice(t.TongTien)}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Account Lock Modal */}
      <Modal 
        isOpen={isLockModalOpen} 
        onClose={() => setIsLockModalOpen(false)} 
        title="Khóa tài khoản khách hàng"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs leading-relaxed text-red-800">
            <AlertTriangle size={20} className="shrink-0 text-red-600 mt-0.5" />
            <p>Hành động này sẽ khóa tài khoản của <strong className="font-semibold text-red-900">{selectedCust?.HoTen}</strong>, ngăn chặn hoàn toàn việc đăng nhập và đặt vé trực tuyến.</p>
          </div>

          <FormField label="Lý do khóa tài khoản" required helperText="Ghi rõ lý do vi phạm hoặc yêu cầu khóa tài khoản.">
            <textarea 
              required
              className="min-h-[100px] resize-y"
              placeholder="Nhập lý do chi tiết..."
              value={lockReason}
              onChange={e => setLockReason(e.target.value)}
            />
          </FormField>

          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <AdminButton 
              type="button" 
              variant="outline"
              onClick={() => setIsLockModalOpen(false)}
            >
              Hủy
            </AdminButton>
            <AdminButton 
              type="button"
              variant="danger"
              disabled={!lockReason.trim()}
              onClick={handleToggleLockStatus}
            >
              Xác nhận khóa
            </AdminButton>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Mở khóa tài khoản"
        message={confirmState.data ? `Bạn có chắc chắn muốn mở khóa tài khoản cho ${confirmState.data.HoTen}?` : ''}
        confirmText="Mở khóa"
        cancelText="Hủy"
        variant="default"
        isLoading={isUnlocking}
        onConfirm={handleConfirmUnlock}
        onCancel={() => setConfirmState({ isOpen: false, data: null })}
      />
    </AdminLayout>
  );
};

export default Customers;
