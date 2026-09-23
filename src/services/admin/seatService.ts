import axiosClient from '@/core/api/axiosClient';

const getAisles = (cols: number) => {
  if (cols <= 6) return [];
  if (cols <= 10) return [3, 8];
  return [Math.floor(cols / 3) + 1, Math.floor(cols * 2 / 3) + 1];
};

const seatService = {
  getSeatMaps: async () => {
    const data: any = await axiosClient.get('/admin/so-do-ghe');
    return data.map((r: any) => ({
      MaSoDoGhe: r.MaSoDo,
      TenSoDo: r.TenSoDo,
      TongHang: r.SoHang,
      TongCot: r.SoCot,
      CauTruc: r.CauTruc || JSON.stringify({ aisles: { rows: [], cols: getAisles(r.SoCot) } }),
      KhaDung: r.KhaDung ? 1 : 0
    }));
  },

  getSeatMapByRoomId: async (roomId: string) => {
    const room: any = await axiosClient.get(`/admin/phong-chieu/${roomId}`);
    const template: any = await axiosClient.get(`/admin/so-do-ghe/${room.MaSoDo}`);
    return {
      MaSoDoGhe: template.MaSoDo,
      TenSoDo: template.TenSoDo,
      TongHang: template.SoHang,
      TongCot: template.SoCot,
      CauTruc: template.CauTruc || JSON.stringify({ aisles: { rows: [], cols: getAisles(template.SoCot) } }),
      KhaDung: template.KhaDung ? 1 : 0
    };
  },

  getSeatsByRoom: async (roomId: string) => {
    const data: any = await axiosClient.get(`/admin/phong-chieu/${roomId}/ghe`);
    return data.map((s: any) => ({
      MaGhe: s.MaGhe,
      ViTriDay: s.ViTriDay,
      ViTriCot: s.ViTriCot,
      MaLoaiGhe: s.MaLoaiGhe,
      KhaDung: s.KhaDung ? 1 : 0
    }));
  },

  saveSeatConfig: async (roomId: string, overrides: Record<string, any>) => {
    const ghes = Object.entries(overrides)
      .filter(([, value]) => value.MaGhe)
      .map(([, value]) => ({
        maGhe: value.MaGhe,
        maLoaiGhe: value.MaLoaiGhe,
        khaDung: value.KhaDung === 1
      }));

    if (ghes.length > 0) {
      await axiosClient.put(`/admin/phong-chieu/${roomId}/ghe`, { ghes });
      return true;
    }
    return false;
  },

  addSeatMap: async (data: any) => {
    const payload = {
      TenSoDo: data.TenSoDo || data.MaSoDoGhe || `Sơ đồ ${data.TongHang}x${data.TongCot}`,
      SoHang: Number(data.TongHang),
      SoCot: Number(data.TongCot),
      CauTruc: data.CauTruc
    };
    const res: any = await axiosClient.post('/admin/so-do-ghe', payload);
    return {
      MaSoDoGhe: res.MaSoDo,
      TenSoDo: res.TenSoDo,
      TongHang: res.SoHang,
      TongCot: res.SoCot,
      CauTruc: res.CauTruc || JSON.stringify({ aisles: { rows: [], cols: getAisles(res.SoCot) } }),
      KhaDung: res.KhaDung ? 1 : 0
    };
  },

  updateSeatMap: async (id: string, data: any) => {
    const payload = {
      TenSoDo: data.TenSoDo || data.MaSoDoGhe || `Sơ đồ ${data.TongHang}x${data.TongCot}`,
      SoHang: Number(data.TongHang),
      SoCot: Number(data.TongCot),
      CauTruc: data.CauTruc,
      KhaDung: data.KhaDung === 1
    };
    const res: any = await axiosClient.put(`/admin/so-do-ghe/${id}`, payload);
    return {
      MaSoDoGhe: res.MaSoDo,
      TenSoDo: res.TenSoDo,
      TongHang: res.SoHang,
      TongCot: res.SoCot,
      CauTruc: res.CauTruc || JSON.stringify({ aisles: { rows: [], cols: getAisles(res.SoCot) } }),
      KhaDung: res.KhaDung ? 1 : 0
    };
  },

  deleteSeatMap: async (id: string) => {
    await axiosClient.delete(`/admin/so-do-ghe/${id}`);
    return true;
  }
};

export default seatService;
