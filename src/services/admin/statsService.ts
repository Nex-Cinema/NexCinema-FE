import axiosClient from '@/apis/axiosClient';

const statsService = {
  getRevenueStats: async (filters: Record<string, any> = {}) => {
    const { startDate, endDate, maPhim } = filters;
    const params = {
      ...(startDate && { tuNgay: startDate }),
      ...(endDate && { denNgay: endDate }),
      ...(maPhim && { maPhim }),
    };

    const fillParams = {
      ...(startDate && { tuNgay: startDate }),
      ...(endDate && { denNgay: endDate }),
    };

    const [revData, fillData, resReceipts]: [any, any, any] = await Promise.all([
      axiosClient.get('/admin/thong-ke/doanh-thu', { params }),
      axiosClient.get('/admin/thong-ke/ti-le-ghe', { params: fillParams }),
      axiosClient.get('/admin/giao-dich/phieu-dat?limit=1000')
    ]);

    const receipts = Array.isArray(resReceipts) ? resReceipts : (resReceipts?.data || []);

    const totalRevenue = revData?.TongDoanhThu || 0;
    const ticketsSold = revData?.DoanhThuTheoPhim?.reduce((sum: number, p: any) => sum + p.SoVeBanRa, 0) || 0;

    const totalOccupied = fillData?.reduce((sum: number, item: any) => sum + item.SoGheDaDat, 0) || 0;
    const totalCapacity = fillData?.reduce((sum: number, item: any) => sum + item.TongSoGhe, 0) || 0;
    const occupancyRate = totalCapacity > 0 ? ((totalOccupied / totalCapacity) * 100).toFixed(1) : '0.0';

    let hotMovie = 'N/A';
    if (revData?.DoanhThuTheoPhim && revData.DoanhThuTheoPhim.length > 0) {
      const sorted = [...revData.DoanhThuTheoPhim].sort((a: any, b: any) => b.DoanhThu - a.DoanhThu);
      hotMovie = sorted[0].TenPhim;
    }

    const dailyMap: Record<string, number> = {};
    receipts.forEach((p: any) => {
      if (p.TrangThai === 'DA_THANH_TOAN') {
        const dateStr = p.NgayTao ? new Date(p.NgayTao).toISOString().substring(0, 10) : '';
        if (startDate && dateStr < startDate) return;
        if (endDate && dateStr > endDate) return;

        const dateParts = dateStr.split('-');
        if (dateParts.length === 3) {
          const formattedDay = `${dateParts[2]}/${dateParts[1]}`;
          dailyMap[formattedDay] = (dailyMap[formattedDay] || 0) + parseFloat(p.TongTien);
        }
      }
    });

    const dailyRevenueData = Object.entries(dailyMap).map(([day, revenue]) => ({
      day,
      revenue
    })).sort((a, b) => {
      const [da, ma] = a.day.split('/').map(Number);
      const [db, mb] = b.day.split('/').map(Number);
      return new Date(2026, ma - 1, da).getTime() - new Date(2026, mb - 1, db).getTime();
    });

    const movieRevenueData = (revData?.DoanhThuTheoPhim || [])
      .map((p: any) => ({
        name: p.TenPhim,
        value: p.DoanhThu
      }))
      .sort((a: any, b: any) => b.value - a.value);

    const roomMap: Record<string, { tickets: number; capacity: number }> = {};
    (fillData || []).forEach((item: any) => {
      const name = item.TenPhong;
      if (!roomMap[name]) {
        roomMap[name] = { tickets: 0, capacity: 0 };
      }
      roomMap[name].tickets += item.SoGheDaDat;
      roomMap[name].capacity += item.TongSoGhe;
    });

    const roomOccupancyData = Object.entries(roomMap)
      .filter(([, d]) => d.capacity > 0)
      .map(([name, d]) => ({
        name,
        value: Math.round((d.tickets / d.capacity) * 100)
      }));

    const moviePerformance: Record<string, { shows: number; tickets: number; capacity: number }> = {};
    (fillData || []).forEach((item: any) => {
      const name = item.TenPhim;
      if (!moviePerformance[name]) {
        moviePerformance[name] = { shows: 0, tickets: 0, capacity: 0 };
      }
      moviePerformance[name].shows += 1;
      moviePerformance[name].tickets += item.SoGheDaDat;
      moviePerformance[name].capacity += item.TongSoGhe;
    });

    const performanceDetails = Object.entries(moviePerformance).map(([name, d]) => ({
      name,
      shows: d.shows,
      tickets: d.tickets,
      fill: d.capacity > 0 ? `${Math.round((d.tickets / d.capacity) * 100)}%` : '0%'
    }));

    return {
      totalRevenue,
      ticketsSold,
      occupancyRate: `${occupancyRate}%`,
      hotMovie,
      dailyRevenueData,
      movieRevenueData,
      roomOccupancyData,
      performanceDetails
    };
  },

  exportRevenueReport: async (format: string) => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1200);
    return {
      success: true,
      format,
      fileName: `BaoCaoDoanhThu_${new Date().toISOString().substring(0, 10)}_${Math.floor(Math.random() * 1000)}.${format === 'Excel' ? 'xlsx' : 'pdf'}`,
    };
  }
};

export default statsService;
