import axiosClient from '@/core/api/axiosClient';

const mapRoom = (r: any) => ({
  MaPhongChieu: r.MaPhong,
  MaPhong: r.MaPhong,
  TenPhong: r.TenPhong,
  MaLoaiPhong: r.MaLoaiPhong || r.LoaiPhong?.MaLoaiPhong || '',
  TenLoaiPhong: r.LoaiPhong?.TenLoaiPhong || 'Standard',
  MaSoDo: r.MaSoDo || r.SoDoGhe?.MaSoDo || '',
  TongSoGhe: r.TongSoGhe || 0,
  KhaDung: r.KhaDung ? 1 : 0,
});

const roomService = {
  getRooms: async (params: Record<string, any> = {}) => {
    const res: any = await axiosClient.get('/admin/phong-chieu', { params });
    const items = Array.isArray(res) ? res : res?.data || [];
    return items.map(mapRoom);
  },

  getRoomById: async (id: string) => {
    const data = await axiosClient.get(`/admin/phong-chieu/${id}`);
    return mapRoom(data);
  },

  createRoom: async (payload: any) => {
    const data = await axiosClient.post('/admin/phong-chieu', payload);
    return mapRoom(data);
  },

  updateRoom: async (maPhong: string, payload: any) => {
    const data = await axiosClient.put(`/admin/phong-chieu/${maPhong}`, payload);
    return mapRoom(data);
  },

  deleteRoom: async (maPhong: string) => {
    return axiosClient.delete(`/admin/phong-chieu/${maPhong}`);
  },

  getRoomTypes: async () => {
    const data: any = await axiosClient.get('/admin/loai-phong');
    return Array.isArray(data) ? data : data?.data || [];
  },

  createRoomType: async (payload: any) => {
    const data = await axiosClient.post('/admin/loai-phong', payload);
    return data;
  },

  updateRoomType: async (id: string, payload: any) => {
    const data = await axiosClient.put(`/admin/loai-phong/${id}`, payload);
    return data;
  },

  deleteRoomType: async (id: string) => {
    return axiosClient.delete(`/admin/loai-phong/${id}`);
  },
};

export default roomService;
