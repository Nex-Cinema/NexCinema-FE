import axiosClient from '@/core/api/axiosClient';

const mapMovie = (m: any) => ({
  MaPhim: m.MaPhim,
  TenPhim: m.TenPhim,
  DaoDien: m.DaoDien || '',
  DienVien: m.DienVien || '',
  TheLoai: m.TheLoai || '',
  ThoiLuong: m.ThoiLuong || 0,
  NgayKhoiChieu: m.NgayKhoiChieu || '',
  NgayKetThuc: m.NgayKetThuc || '',
  QuocGia: m.QuocGia || 'Việt Nam',
  GioiHanTuoi: m.GioiHanTuoi || 'P',
  NoiDung: m.NoiDung || '',
  HinhAnh: m.HinhAnh || '',
  Trailer: m.Trailer || '',
  KhaDung: m.KhaDung ? 1 : 0,
});

const movieService = {
  getMovies: async (params: Record<string, any> = {}) => {
    const res: any = await axiosClient.get('/admin/phim', { params });
    const items = Array.isArray(res) ? res : res?.data || [];
    return items.map(mapMovie);
  },

  getMovieById: async (id: string) => {
    const data: any = await axiosClient.get(`/admin/phim/${id}`);
    return mapMovie(data);
  },

  createMovie: async (payload: any) => {
    const data = await axiosClient.post('/admin/phim', payload);
    return mapMovie(data);
  },

  updateMovie: async (id: string, payload: any) => {
    const data = await axiosClient.put(`/admin/phim/${id}`, payload);
    return mapMovie(data);
  },

  deleteMovie: async (id: string) => {
    return axiosClient.delete(`/admin/phim/${id}`);
  },
};

export default movieService;
