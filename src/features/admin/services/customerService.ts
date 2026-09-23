import axiosClient from '@/core/api/axiosClient';

const mapCustomer = (u: any) => ({
  MaKhachHang: u.KhachHang?.MaKhachHang || u.MaTaiKhoan,
  MaTaiKhoan: u.MaTaiKhoan,
  HoTen: u.HoTen,
  Email: u.Email,
  SoDienThoai: u.SoDienThoai || 'Chưa cập nhật',
  GioiTinh: u.GioiTinh || 'Khác',
  NgaySinh: u.NgaySinh || null,
  DiemTichLuy: u.KhachHang?.DiemTichLuy || 0,
  KhaDung: u.KhaDung ? 1 : 0,
  CreatedAt: u.createdAt || null,
});

const customerService = {
  getCustomers: async (params: Record<string, any> = {}) => {
    const res: any = await axiosClient.get('/admin/khach-hang', { params });
    const items = Array.isArray(res) ? res : res?.data || [];
    return items.map(mapCustomer);
  },

  getCustomerById: async (id: string) => {
    const data: any = await axiosClient.get(`/admin/khach-hang/${id}`);
    return mapCustomer(data);
  },

  updateCustomerStatus: async (id: string, khaDung: boolean) => {
    return axiosClient.patch(`/admin/khach-hang/${id}/status`, { KhaDung: khaDung });
  },
};

export default customerService;
