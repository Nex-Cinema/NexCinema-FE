import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import AdminTable from '../../components/Admin/Common/AdminTable';
import StatusBadge from '../../components/Admin/Common/StatusBadge';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import adminService from '../../services/adminService';
import useAdminForm from '../../hooks/useAdminForm';
import { LayoutGrid, Plus, Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { showSuccess, showError } from '../../utils/toastHelper';

import { useClientPagination } from '../../hooks/useClientPagination';
import AdminToolbar from '../../components/Admin/Common/AdminToolbar';
import AdminPagination from '../../components/Admin/Common/AdminPagination';
import AdminButton from '../../components/Admin/Common/AdminButton';
import { AdminEmptyState, AdminLoadingSkeleton } from '../../components/Admin/Common/AdminState';
import RoomModal from '../../components/Admin/Rooms/RoomModal';
import AdminFilterSelect from '../../components/Admin/Common/AdminFilterSelect';

const Rooms = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roomTypes, setRoomTypes] = useState([]);
  const [seatMaps, setSeatMaps] = useState([]);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const initialFormState = {
    TenPhong: '',
    MaLoaiPhong: '',
    MaSoDoGhe: '',
    KhaDung: 1
  };

  const loadData = async () => {
    const [roomsData, typesData, mapsData] = await Promise.all([
      adminService.getRooms(),
      adminService.getRoomTypes(),
      adminService.getSeatMaps()
    ]);
    setRooms(roomsData);
    setRoomTypes(typesData);
    setSeatMaps(mapsData);
    setLoading(false);
  };

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      const [roomsData, typesData, mapsData] = await Promise.all([
        adminService.getRooms(),
        adminService.getRoomTypes(),
        adminService.getSeatMaps()
      ]);
      if (!ignore) {
        setRooms(roomsData);
        setRoomTypes(typesData);
        setSeatMaps(mapsData);
        setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, []);

  const getSeatCount = (seatMapId) => {
    const map = seatMaps.find(m => m.MaSoDoGhe === seatMapId);
    return map ? map.TongHang * map.TongCot : 0;
  };

  const {
    formData,
    setFormData,
    errors,
    handleChange,
    handleSubmit
  } = useAdminForm(initialFormState, async (data, { resetForm }) => {
    const processedData = {
      ...data,
      KhaDung: parseInt(data.KhaDung, 10),
      SoGhe: getSeatCount(data.MaSoDoGhe)
    };

    if (editingRoom) {
      await adminService.updateRoom(editingRoom.MaPhongChieu, processedData);
      showSuccess("Cập nhật phòng chiếu thành công!");
    } else {
      await adminService.addRoom(processedData);
      showSuccess("Thêm phòng chiếu mới thành công!");
    }
    
    await loadData();
    setIsModalOpen(false);
    setEditingRoom(null);
    resetForm();
  });

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setFormData({
      TenPhong: '',
      MaLoaiPhong: roomTypes[0]?.MaLoaiPhong || '',
      MaSoDoGhe: seatMaps[0]?.MaSoDoGhe || '',
      KhaDung: 1
    });
    setIsModalOpen(true);
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
    setFormData({
      TenPhong: room.TenPhong,
      MaLoaiPhong: room.MaLoaiPhong,
      MaSoDoGhe: room.MaSoDoGhe,
      KhaDung: room.KhaDung
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
      const success = await adminService.deleteRoom(id);
      if (success) {
        showSuccess("Xóa phòng chiếu khỏi cơ sở dữ liệu thành công!");
        await loadData();
      }
    } catch (err) {
      showError(`Lỗi khi xóa: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setConfirmState({ isOpen: false, data: null });
    }
  };

  // Pre-inject room type names for client-side search
  const roomsWithTypes = useMemo(() => {
    return rooms.map(room => {
      const type = roomTypes.find(t => t.MaLoaiPhong === room.MaLoaiPhong);
      return {
        ...room,
        TenLoaiPhong: type ? type.TenLoaiPhong : ''
      };
    });
  }, [rooms, roomTypes]);

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
    roomsWithTypes,
    ['TenPhong', 'TenLoaiPhong'],
    (room, f) => {
      const matchType = !f.roomType || f.roomType === 'All' || room.MaLoaiPhong === f.roomType;
      const matchKhaDung = !f.activeStatus || f.activeStatus === 'All' || room.KhaDung === Number(f.activeStatus);
      return matchType && matchKhaDung;
    }
  );

  const columns = [
    {
      header: 'Tên phòng chiếu',
      render: (room) => (
        <Link 
          to={`/admin/rooms/${room.MaPhongChieu}/seats`}
          className="font-bold text-white hover:text-red-500 transition-colors"
        >
          {room.TenPhong}
        </Link>
      )
    },
    { header: 'Số ghế', render: (room) => <span className="text-slate-200 font-bold font-mono">{room.SoGhe} ghế</span> },
    {
      header: 'Loại phòng',
      render: (room) => roomTypes.find((type) => type.MaLoaiPhong === room.MaLoaiPhong)?.TenLoaiPhong || 'Chưa rõ',
    },
    {
      header: 'Khả dụng',
      render: (room) => <StatusBadge status={room.KhaDung} />
    },
    {
      header: 'Thời gian',
      render: (room) => (
        <div className="flex flex-col text-[10px] text-slate-500 font-mono">
          <span>Tạo: {room.NgayTao || '--:--'}</span>
          <span>Sửa: {room.NgayCapNhat || '--:--'}</span>
        </div>
      )
    },
    {
      header: 'Hành động',
      className: 'text-right',
      render: (room) => (
        <div className="flex justify-end gap-2">
          <Link 
            to={`/admin/rooms/${room.MaPhongChieu}/seats`}
            className="p-2 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Cấu hình ghế"
          >
            <LayoutGrid size={18} />
          </Link>
          <button 
            onClick={() => handleEdit(room)}
            className="p-2 hover:bg-white/5 text-blue-500 hover:text-blue-400 rounded-xl transition-all cursor-pointer"
            title="Sửa"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => handleDelete(room.MaPhongChieu)}
            className="p-2 hover:bg-white/5 text-red-500 hover:text-red-400 rounded-xl transition-all cursor-pointer"
            title="Xóa"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Quản lý phòng chiếu"
        subtitle="Định nghĩa và kiểm soát cơ sở hạ tầng phòng chiếu vật lý."
        action={
          <AdminButton icon={Plus} onClick={handleOpenAddModal} className="w-full justify-center md:w-auto">
            Thêm phòng chiếu
          </AdminButton>
        }
      />

      {/* Filters and search using AdminToolbar */}
      <AdminToolbar
        searchPlaceholder="Tìm theo tên phòng, tên loại phòng..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filterSlot={
          <>
            {/* Room Type filter */}
            <AdminFilterSelect
              aria-label="Lọc theo loại phòng"
              value={filters.roomType || 'All'}
              onChange={e => setFilterVal('roomType', e.target.value)}
            >
              <option value="All">Tất cả loại phòng</option>
              {roomTypes.map(type => (
                <option key={type.MaLoaiPhong} value={type.MaLoaiPhong}>
                  {type.TenLoaiPhong} ({type.MaLoaiPhong})
                </option>
              ))}
            </AdminFilterSelect>

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
          title="Không tìm thấy phòng chiếu"
          description="Thử thay đổi từ khóa hoặc bộ lọc để xem thêm kết quả."
        />
      ) : (
        <>
          <AdminTable columns={columns} data={paginatedItems} rowKey="MaPhongChieu" />
          <AdminPagination
            page={page}
            pageSize={pageSize}
            total={totalItems}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </>
      )}

      <RoomModal
        isOpen={isModalOpen}
        editingRoom={editingRoom}
        formData={formData}
        errors={errors}
        roomTypes={roomTypes}
        seatMaps={seatMaps}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRoom(null);
        }}
      />

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title="Xóa phòng chiếu"
        message={`Bạn có chắc chắn muốn xóa phòng chiếu ${confirmState.data} khỏi cơ sở dữ liệu?`}
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

export default Rooms;
