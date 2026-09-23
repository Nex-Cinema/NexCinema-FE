import axiosClient from '@/core/api/axiosClient';

const showtimeService = {
  getShowtimes: async () => {
    const data: any = await axiosClient.get('/admin/suat-chieu');
    const items = Array.isArray(data) ? data : data?.data || [];

    return Promise.all(
      items.map(async (st: any) => {
        let gheList = [];
        try {
          gheList = await axiosClient.get(`/admin/suat-chieu/${st.MaSuatChieu}/ghe`);
          if (!Array.isArray(gheList)) gheList = (gheList as any)?.data || [];
        } catch {
          gheList = [];
        }

        const tongSoGhe = gheList.length || st.PhongChieu?.TongSoGhe || 100;
        const gheDaDat = gheList.filter(
          (g: any) => g.TrangThai === 'DA_DAT' || g.TrangThai === 'DANG_GIU'
        ).length;

        const gioChieuDate = st.GioChieu ? new Date(st.GioChieu) : null;
        const gioChieuStr = gioChieuDate
          ? gioChieuDate.toTimeString().substring(0, 5)
          : '';

        const thoiLuong = st.Phim?.ThoiLuong || 120;
        let gioKetThucStr = '';
        if (gioChieuDate && thoiLuong) {
          const end = new Date(gioChieuDate.getTime() + thoiLuong * 60 * 1000);
          gioKetThucStr = end.toTimeString().substring(0, 5);
        }

        return {
          MaSuatChieu: st.MaSuatChieu,
          MaPhim: st.MaPhim,
          TenPhim: st.Phim?.TenPhim || 'Chưa xác định',
          HinhAnh: st.Phim?.HinhAnh || '',
          MaPhong: st.MaPhong,
          TenPhong: st.PhongChieu?.TenPhong || 'N/A',
          LoaiPhong: st.PhongChieu?.LoaiPhong?.TenLoaiPhong || '2D Standard',
          NgayChieu: st.NgayChieu ? new Date(st.NgayChieu).toISOString().substring(0, 10) : '',
          GioChieu: gioChieuStr,
          GioKetThuc: gioKetThucStr,
          GiaVeGoc: parseFloat(st.GiaVeGoc) || 75000,
          TongSoGhe: tongSoGhe,
          GheDaDat: gheDaDat,
          KhaDung: st.KhaDung ? 1 : 0,
        };
      })
    );
  },

  createShowtime: async (payload: {
    MaPhim: string;
    MaPhong: string;
    NgayChieu: string;
    GioChieu: string;
    GiaVeGoc: number;
  }) => {
    const data = await axiosClient.post('/admin/suat-chieu', payload);
    return data;
  },

  updateShowtime: async (
    id: string,
    payload: {
      MaPhim?: string;
      MaPhong?: string;
      NgayChieu?: string;
      GioChieu?: string;
      GiaVeGoc?: number;
      KhaDung?: boolean;
    }
  ) => {
    const data = await axiosClient.put(`/admin/suat-chieu/${id}`, payload);
    return data;
  },

  deleteShowtime: async (id: string) => {
    await axiosClient.delete(`/admin/suat-chieu/${id}`);
  },

  getShowtimeSeats: async (maSuatChieu: string) => {
    const data: any = await axiosClient.get(`/admin/suat-chieu/${maSuatChieu}/ghe`);
    return Array.isArray(data) ? data : data?.data || [];
  },
};

export default showtimeService;
