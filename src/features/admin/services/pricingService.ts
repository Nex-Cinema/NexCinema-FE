import axiosClient from '@/core/api/axiosClient';

const mapSeatType = (t: any) => ({
  MaLoaiGhe: t.MaLoaiGhe,
  TenLoaiGhe: t.TenLoaiGhe,
  PhuThu: parseFloat(t.PhuThu) || 0,
  MoTa: t.MoTa || '',
});

const mapRoomType = (r: any) => ({
  MaLoaiPhong: r.MaLoaiPhong,
  TenLoaiPhong: r.TenLoaiPhong,
  PhuThu: parseFloat(r.PhuThu) || 0,
  MoTa: r.MoTa || '',
});

const pricingService = {
  getSeatTypes: async () => {
    const data: any = await axiosClient.get('/admin/loai-ghe');
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.map(mapSeatType);
  },

  updateSeatType: async (id: string, payload: any) => {
    const data = await axiosClient.put(`/admin/loai-ghe/${id}`, payload);
    return mapSeatType(data);
  },

  getRoomTypes: async () => {
    const data: any = await axiosClient.get('/admin/loai-phong');
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.map(mapRoomType);
  },

  updateRoomType: async (id: string, payload: any) => {
    const data = await axiosClient.put(`/admin/loai-phong/${id}`, payload);
    return mapRoomType(data);
  },
};

export default pricingService;
