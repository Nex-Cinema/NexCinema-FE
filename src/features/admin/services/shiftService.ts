import axiosClient from '@/core/api/axiosClient';

const formatTime = (t: any) => {
  if (!t) return '00:00:00';
  if (typeof t === 'string') {
    if (t.includes('T')) {
      return t.split('T')[1].substring(0, 8);
    }
    return t;
  }
  return '00:00:00';
};

const mapShift = (c: any) => ({
  MaCa: c.MaCa,
  TenCa: c.TenCa,
  GioBatDau: formatTime(c.GioBatDau),
  GioKetThuc: formatTime(c.GioKetThuc),
  MoTa: c.MoTa || '',
  KhaDung: c.KhaDung ? 1 : 0,
});

const shiftService = {
  getShifts: async () => {
    const data: any = await axiosClient.get('/admin/ca-lam-viec');
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.map(mapShift);
  },

  createShift: async (payload: { TenCa: string; GioBatDau: string; GioKetThuc: string; MoTa?: string }) => {
    const data = await axiosClient.post('/admin/ca-lam-viec', payload);
    return mapShift(data);
  },

  updateShift: async (
    maCa: string,
    payload: { TenCa: string; GioBatDau: string; GioKetThuc: string; MoTa?: string }
  ) => {
    const data = await axiosClient.put(`/admin/ca-lam-viec/${maCa}`, payload);
    return mapShift(data);
  },

  deleteShift: async (maCa: string) => {
    await axiosClient.delete(`/admin/ca-lam-viec/${maCa}`);
  },

  getSchedules: async () => {
    const data: any = await axiosClient.get('/admin/ca-lam-viec/phan-ca/lich-truc');
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.map((s: any) => ({
      MaChiTietCa: s.MaChiTietCa,
      MaCa: s.MaCa,
      TenCa: s.CaLamViec?.TenCa || '',
      GioBatDau: formatTime(s.CaLamViec?.GioBatDau),
      GioKetThuc: formatTime(s.CaLamViec?.GioKetThuc),
      MaNhanVien: s.MaNhanVien,
      TenNhanVien: s.NhanVien?.TaiKhoan?.HoTen || s.NhanVien?.HoTen || s.MaNhanVien,
      NgayLamViec: s.NgayLamViec ? new Date(s.NgayLamViec).toISOString().substring(0, 10) : '',
      DiemDanh: Boolean(s.DiemDanh),
      GhiChu: s.GhiChu || '',
    }));
  },

  assignShifts: async (assignments: Array<{ MaCa: string; MaNhanVien: string; NgayLamViec: string; GhiChu?: string }>) => {
    let lastResult = null;
    for (const payload of assignments) {
      lastResult = await axiosClient.post('/admin/ca-lam-viec/phan-ca', payload);
    }
    return lastResult;
  },

  toggleCheckIn: async (maChiTietCa: string) => {
    const data: any = await axiosClient.patch(`/admin/ca-lam-viec/phan-ca/${maChiTietCa}/toggle`);
    return {
      MaChiTietCa: data.MaChiTietCa,
      DiemDanh: Boolean(data.DiemDanh),
    };
  },

  deleteAssignment: async (maChiTietCa: string) => {
    await axiosClient.delete(`/admin/ca-lam-viec/phan-ca/${maChiTietCa}`);
  },
};

export default shiftService;
