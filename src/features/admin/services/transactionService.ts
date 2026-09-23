import axiosClient from '@/core/api/axiosClient';

const transactionService = {
  getTransactions: async () => {
    const res: any = await axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000');
    const items = Array.isArray(res) ? res : res?.data || [];

    return items.map((pd: any) => {
      const ghes = Array.isArray(pd.VeBans)
        ? pd.VeBans.map((v: any) => {
            const ghe = v.GheSuatChieu?.Ghe;
            return ghe ? `${ghe.ViTriDay}${ghe.ViTriCot}` : '';
          })
            .filter(Boolean)
            .join(', ')
        : '';

      const gioChieuDate = pd.SuatChieu?.GioChieu ? new Date(pd.SuatChieu.GioChieu) : null;
      const gioChieuStr = gioChieuDate ? gioChieuDate.toTimeString().substring(0, 5) : '';

      return {
        MaPhieuDat: pd.MaPhieuDat,
        MaKhachHang: pd.MaKhachHang || pd.KhachHang?.MaKhachHang || 'KHACH_LE',
        TenKhachHang: pd.KhachHang?.TaiKhoan?.HoTen || pd.TenKhachHang || 'Khách vãng lai',
        Email: pd.KhachHang?.TaiKhoan?.Email || pd.Email || '',
        SoDienThoai: pd.KhachHang?.TaiKhoan?.SoDienThoai || pd.SoDienThoai || '',
        TenPhim: pd.SuatChieu?.Phim?.TenPhim || 'Chưa xác định',
        TenPhong: pd.SuatChieu?.PhongChieu?.TenPhong || 'N/A',
        LoaiPhong: pd.SuatChieu?.PhongChieu?.LoaiPhong?.TenLoaiPhong || '2D Standard',
        NgayChieu: pd.SuatChieu?.NgayChieu
          ? new Date(pd.SuatChieu.NgayChieu).toISOString().substring(0, 10)
          : '',
        GioChieu: gioChieuStr,
        DanhSachGhe: ghes || 'N/A',
        TongTien: parseFloat(pd.TongTien) || 0,
        PhuongThucThanhToan: pd.PhuongThucThanhToan || 'VNPAY',
        TrangThai: pd.TrangThai || 'CHUA_THANH_TOAN',
        NgayDat: pd.NgayDat
          ? new Date(pd.NgayDat).toLocaleString('vi-VN')
          : pd.createdAt
          ? new Date(pd.createdAt).toLocaleString('vi-VN')
          : '',
      };
    });
  },

  cancelBooking: async (maPhieuDat: string) => {
    try {
      await axiosClient.patch(`/admin/giao-dich/phieu-dat/${maPhieuDat}/huy`);
      return { success: true };
    } catch {
      // Fallback polling check
      const res: any = await axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000');
      const items = Array.isArray(res) ? res : res?.data || [];
      const pd = items.find((item: any) => item.MaPhieuDat === maPhieuDat);
      if (pd && pd.TrangThai === 'DA_HUY') {
        return { success: true };
      }
      throw new Error('Hủy phiếu đặt thất bại.');
    }
  },

  createRefund: async (maGiaoDich: string, payload: { SoTienHoan: number; LyDoHoan: string }) => {
    await axiosClient.post(`/admin/giao-dich/${maGiaoDich}/hoan-tien`, {
      SoTien: payload.SoTienHoan,
      LyDo: payload.LyDoHoan,
    });
    return { success: true };
  },

  getRefundRequests: async (params: Record<string, any> = {}) => {
    return axiosClient.get('/admin/hoan-tien', { params });
  },

  getRefundRequestById: async (maHoanTien: string) => {
    return axiosClient.get(`/admin/hoan-tien/${maHoanTien}`);
  },

  approveRefund: async (maHoanTien: string, payload: { GhiChuAdmin?: string } = {}) => {
    return axiosClient.patch(`/admin/hoan-tien/${maHoanTien}/duyet`, payload);
  },

  rejectRefund: async (maHoanTien: string, payload: { GhiChuAdmin?: string } = {}) => {
    return axiosClient.patch(`/admin/hoan-tien/${maHoanTien}/tu-choi`, payload);
  },
};

export default transactionService;
