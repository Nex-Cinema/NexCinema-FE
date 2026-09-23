import axiosClient from '@/core/api/axiosClient';

const getAisles = (cols: number) => {
  if (cols <= 6) return [];
  if (cols <= 10) return [Math.floor(cols / 2)];
  return [3, cols - 3];
};

const seatService = {
  getTemplates: async () => {
    const data: any = await axiosClient.get('/admin/so-do-ghe');
    const items = Array.isArray(data) ? data : data?.data || [];
    return items.map((t: any) => ({
      MaSoDo: t.MaSoDo,
      TenSoDo: t.TenSoDo,
      SoHang: t.SoHang || 10,
      SoCot: t.SoCot || 12,
      Aisles: getAisles(t.SoCot || 12),
      KhaDung: t.KhaDung ? 1 : 0,
    }));
  },

  getRoomSeatMap: async (roomId: string) => {
    const room: any = await axiosClient.get(`/admin/phong-chieu/${roomId}`);
    const template: any = await axiosClient.get(`/admin/so-do-ghe/${room.MaSoDo}`);
    const rows = template.SoHang || 10;
    const cols = template.SoCot || 12;

    const rowLetters = [];
    for (let i = 0; i < rows; i++) {
      rowLetters.push(String.fromCharCode(65 + i));
    }

    const aisles = getAisles(cols);

    const data: any = await axiosClient.get(`/admin/phong-chieu/${roomId}/ghe`);
    const seatsRaw = Array.isArray(data) ? data : data?.data || [];

    const seatsMap: Record<string, any[]> = {};
    seatsRaw.forEach((g: any) => {
      const row = g.ViTriDay;
      if (!seatsMap[row]) seatsMap[row] = [];
      seatsMap[row].push({
        id: g.MaGhe,
        MaGhe: g.MaGhe,
        row: g.ViTriDay,
        col: g.ViTriCot,
        type: g.LoaiGhe?.TenLoaiGhe === 'VIP' ? 'VIP' : g.LoaiGhe?.TenLoaiGhe === 'COUPLE' ? 'COUPLE' : 'STANDARD',
        status: g.KhaDung ? 'AVAILABLE' : 'BLOCKED',
      });
    });

    return { rows: rowLetters, cols, aisles, seatsMap };
  },

  updateRoomSeats: async (roomId: string, ghes: any[]) => {
    return axiosClient.put(`/admin/phong-chieu/${roomId}/ghe`, { ghes });
  },

  createTemplate: async (payload: { TenSoDo: string; SoHang: number; SoCot: number }) => {
    const res: any = await axiosClient.post('/admin/so-do-ghe', payload);
    return {
      MaSoDo: res.MaSoDo || res.data?.MaSoDo,
      TenSoDo: res.TenSoDo || payload.TenSoDo,
      SoHang: res.SoHang || payload.SoHang,
      SoCot: res.SoCot || payload.SoCot,
      Aisles: getAisles(payload.SoCot),
      KhaDung: 1,
    };
  },

  updateTemplate: async (id: string, payload: { TenSoDo: string; SoHang: number; SoCot: number }) => {
    const res: any = await axiosClient.put(`/admin/so-do-ghe/${id}`, payload);
    return {
      MaSoDo: id,
      TenSoDo: res.TenSoDo || payload.TenSoDo,
      SoHang: res.SoHang || payload.SoHang,
      SoCot: res.SoCot || payload.SoCot,
      Aisles: getAisles(payload.SoCot),
      KhaDung: 1,
    };
  },

  deleteTemplate: async (id: string) => {
    return axiosClient.delete(`/admin/so-do-ghe/${id}`);
  },
};

export default seatService;
