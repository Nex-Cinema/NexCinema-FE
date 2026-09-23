import axiosClient from '@/core/api/axiosClient';

const mapUserToStaff = (u: any) => ({
  MaNhanVien: u.NhanVien?.MaNhanVien || u.MaTaiKhoan,
  MaTaiKhoan: u.MaTaiKhoan,
  HoTen: u.HoTen,
  Email: u.Email,
  SoDienThoai: u.SoDienThoai || 'Chưa cập nhật',
  ChucVu: u.NhanVien?.ChucVu || (u.PhanQuyen === 'ADMIN' ? 'Quản lý Rạp' : 'Nhân viên Bán vé'),
  PhanQuyen: u.PhanQuyen || 'STAFF',
  NgayVaoLam: u.NhanVien?.NgayVaoLam || u.createdAt || null,
  KhaDung: u.KhaDung ? 1 : 0,
});

const personnelService = {
  getPersonnel: async (params: Record<string, any> = {}) => {
    const res: any = await axiosClient.get('/admin/nhan-su', { params });
    const items = Array.isArray(res) ? res : res?.data || [];
    return items.map(mapUserToStaff);
  },

  getPersonnelById: async (id: string) => {
    const data: any = await axiosClient.get(`/admin/nhan-su/${id}`);
    return mapUserToStaff(data);
  },

  createPersonnel: async (payload: any) => {
    const data = await axiosClient.post('/admin/nhan-su', payload);
    return mapUserToStaff(data);
  },

  updatePersonnel: async (id: string, payload: any) => {
    const data = await axiosClient.put(`/admin/nhan-su/${id}`, payload);
    return mapUserToStaff(data);
  },

  deletePersonnel: async (id: string) => {
    return axiosClient.delete(`/admin/nhan-su/${id}`);
  },
};

export default personnelService;
