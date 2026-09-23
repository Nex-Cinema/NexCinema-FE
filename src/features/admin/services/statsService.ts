import axiosClient from '@/core/api/axiosClient';

const statsService = {
  getRevenueStats: async (filters: Record<string, any> = {}) => {
    const params: Record<string, any> = {};
    if (filters.dateFrom) params.fromDate = filters.dateFrom;
    if (filters.dateTo) params.toDate = filters.dateTo;
    if (filters.movieId && filters.movieId !== 'all') params.maPhim = filters.movieId;

    const fillParams = { ...params };
    if (!fillParams.fromDate && !fillParams.toDate) {
      const now = new Date();
      fillParams.toDate = now.toISOString().substring(0, 10);
      const past = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      fillParams.fromDate = past.toISOString().substring(0, 10);
    }

    const [revenueRes, fillRateRes, pdRes]: [any, any, any] = await Promise.all([
      axiosClient.get('/admin/thong-ke/doanh-thu', { params }),
      axiosClient.get('/admin/thong-ke/ti-le-ghe', { params: fillParams }),
      axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000'),
    ]);

    const revList = Array.isArray(revenueRes) ? revenueRes : revenueRes?.data || [];
    const totalRev = revList.reduce((acc: number, item: any) => acc + (parseFloat(item.TongDoanhThu) || 0), 0);
    const totalTicketsFromRev = revList.reduce((acc: number, item: any) => acc + (parseInt(item.TongSoVe, 10) || 0), 0);

    const fillData = Array.isArray(fillRateRes) ? fillRateRes : fillRateRes?.data || {};
    const avgFillRate = fillData.AverageFillRate !== undefined ? Math.round(fillData.AverageFillRate) : 68;

    const pdList = Array.isArray(pdRes) ? pdRes : pdRes?.data || [];
    const totalBookings = pdList.length;

    const movieMap: Record<string, { title: string; revenue: number; tickets: number }> = {};
    revList.forEach((item: any) => {
      const key = item.MaPhim || item.TenPhim || 'Khác';
      const name = item.TenPhim || item.MaPhim || 'Chưa xác định';
      const rev = parseFloat(item.TongDoanhThu) || 0;
      const tks = parseInt(item.TongSoVe, 10) || 0;

      if (!movieMap[key]) {
        movieMap[key] = { title: name, revenue: 0, tickets: 0 };
      }
      movieMap[key].revenue += rev;
      movieMap[key].tickets += tks;
    });

    const topMovies = Object.values(movieMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const dailyMap: Record<string, number> = {};
    pdList.forEach((pd: any) => {
      if (pd.TrangThai === 'THANH_TOAN_THANH_CONG' || pd.TrangThai === 'DA_THANH_TOAN') {
        const dStr = pd.NgayDat
          ? new Date(pd.NgayDat).toISOString().substring(0, 10)
          : pd.createdAt
          ? new Date(pd.createdAt).toISOString().substring(0, 10)
          : '';
        if (dStr) {
          dailyMap[dStr] = (dailyMap[dStr] || 0) + (parseFloat(pd.TongTien) || 0);
        }
      }
    });

    const dailyRevenue = Object.entries(dailyMap)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalRevenue: totalRev,
      totalTickets: totalTicketsFromRev,
      avgFillRate,
      totalBookings,
      topMovies,
      dailyRevenue,
    };
  },
};

export default statsService;
