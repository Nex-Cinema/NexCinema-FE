import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import { Lock, MousePointer2, Save, Unlock } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminButton from '../../components/Admin/Common/AdminButton';
import { CinemaSeat, SeatLegend } from '../../components/Seats/SeatVisuals';

const getAdminSeatClassName = (typeName = '') => {
  const normalized = typeName.toUpperCase();
  if (normalized.includes('VIP')) return 'admin-seat--vip';
  if (normalized.includes('ĐÔI') || normalized.includes('COUPLE') || normalized.includes('SWEETBOX')) return 'admin-seat--sweetbox';
  return 'admin-seat--standard';
};

const SeatMaps = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [template, setTemplate] = useState(null);
  const [seatTypes, setSeatTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overrides, setOverrides] = useState({}); // { seatId: { MaLoaiGhe, KhaDung } }
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [roomData, typesData] = await Promise.all([
          adminService.getRoomById(roomId),
          adminService.getSeatTypes()
        ]);
        
        if (!ignore && roomData) {
          setRoom(roomData);
          setSeatTypes(typesData);
          
          // Fetch current seats from backend
          const seatsData = await adminService.getSeatsByRoom(roomId);
          const initialOverrides = {};
          seatsData.forEach(seat => {
            const seatKey = `${roomData.MaPhongChieu}-${seat.ViTriDay}${seat.ViTriCot}`;
            initialOverrides[seatKey] = {
              MaGhe: seat.MaGhe,
              MaLoaiGhe: seat.MaLoaiGhe,
              KhaDung: seat.KhaDung,
              DoRongCot: seat.DoRongCot || 1,
              SucChua: seat.SucChua || 1,
            };
          });
          setOverrides(initialOverrides);
          
          const templateData = await adminService.getSeatMapByRoomId(roomId);
          if (!ignore) {
            setTemplate(templateData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch seat map data:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, [roomId]);

  // Generate matrix based on template and overrides
  const matrix = useMemo(() => {
    if (!template || !room) return [];
    const rows = template.TongHang;
    const cols = template.TongCot;
    const result = [];

    let struct = { aisles: { rows: [], cols: [] } };
    if (template.CauTruc) {
      try {
        struct = typeof template.CauTruc === 'string' ? JSON.parse(template.CauTruc) : template.CauTruc;
      } catch (e) {
        console.error("JSON Parse error", e);
      }
    }
    const couples = Array.isArray(struct?.couples) ? struct.couples : [];
    
    for (let r = 0; r < rows; r++) {
      const row = [];
      const rowChar = String.fromCharCode(65 + r);
      for (let c = 0; c < cols; c++) {
        let isAisle = struct?.aisles?.cols?.includes(c + 1) || struct?.aisles?.rows?.includes(r + 1);
        if (!isAisle && struct?.aisles?.custom) {
          const customRow = struct.aisles.custom.find(item => item.row === r);
          if (customRow) {
            isAisle = customRow.cols.includes(c) || customRow.cols.includes(c + 1);
          }
        }

        const seatId = `${room.MaPhongChieu}-${rowChar}${c + 1}`;
        const coupleStart = couples.some((item) => item.row === r + 1 && item.startCol === c + 1);
        const coupleCovered = couples.some((item) => item.row === r + 1 && item.startCol + 1 === c + 1);
        const baseSeat = {
          MaChiTietSoDo: seatId,
          MaSoDoGhe: room.MaSoDoGhe,
          MaLoaiGhe: seatTypes[0]?.MaLoaiGhe || 'LG01',
          Hang: rowChar,
          Cot: c + 1,
          DoRongCot: coupleStart ? 2 : 1,
          SucChua: coupleStart ? 2 : 1,
          KhaDung: 1,
          isAisle,
          isCovered: coupleCovered,
        };
        // Apply overrides
        row.push({ ...baseSeat, ...(overrides[seatId] || {}) });
      }
      result.push(row);
    }
    return result;
  }, [template, room, overrides, seatTypes]);

  const handleSeatClick = (seatId, e) => {
    if (e.shiftKey) {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    } else {
      setSelectedSeats([seatId]);
    }
  };

  const updateSelectedSeats = (updates) => {
    const newOverrides = { ...overrides };
    selectedSeats.forEach(id => {
      newOverrides[id] = { ...(newOverrides[id] || {}), ...updates };
    });
    setOverrides(newOverrides);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await adminService.saveSeatConfig(roomId, overrides);
      showSuccess("Cấu hình sơ đồ ghế đã được lưu thành công!");
    } catch (error) {
      showError("Lỗi khi lưu cấu hình: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeatTypeName = (typeId) => seatTypes.find((type) => type.MaLoaiGhe === typeId)?.TenLoaiGhe || 'Thường';

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-white animate-pulse font-bold tracking-widest text-sm">ĐANG TẢI SƠ ĐỒ...</div>
      </div>
    </AdminLayout>
  );

  if (!room || !template) return (
    <AdminLayout>
      <div className="text-white p-8">Phòng không tồn tại hoặc chưa cấu hình sơ đồ.</div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <AdminPageHeader
        title={`Cấu hình: ${room.TenPhong}`}
        subtitle={`Sơ đồ gốc: ${template.MaSoDoGhe} (${template.TongHang}x${template.TongCot})`}
        backPath="/admin/rooms"
        action={
          <AdminButton icon={Save} onClick={handleSave} className="w-full justify-center md:w-auto">Lưu cấu hình</AdminButton>
        }
      />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* Toolbox */}
        <div className="space-y-4 xl:sticky xl:top-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_12px_32px_rgba(23,23,23,.06)]">
            <div className="mb-5 flex items-start gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-red-50 text-(--admin-brand)"><MousePointer2 size={17} /></span>
              <div><h3 className="text-sm font-extrabold text-neutral-950">Chỉnh vùng ghế</h3><p className="mt-1 text-[11px] leading-relaxed text-neutral-500">Nhấn một ghế, giữ Shift để chọn thêm.</p></div>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[.16em] text-neutral-400">Loại ghế</label>
                <div className="grid grid-cols-1 gap-2">
                  {seatTypes.map(type => (
                    <button
                      key={type.MaLoaiGhe}
                      onClick={() => updateSelectedSeats({ MaLoaiGhe: type.MaLoaiGhe })}
                      disabled={selectedSeats.length === 0}
                      className="group flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-3 transition-all hover:border-red-200 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      <span className="text-sm font-bold text-neutral-700 group-hover:text-neutral-950">{type.TenLoaiGhe}</span>
                      <CinemaSeat label="" typeName={type.TenLoaiGhe} compact disabled className="pointer-events-none !h-6 !w-8" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 border-t border-neutral-100 pt-4">
                <label className="text-[10px] font-bold uppercase tracking-[.16em] text-neutral-400">Trạng thái vận hành</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 0 })}
                    disabled={selectedSeats.length === 0}
                    className="flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3.5 text-red-600 transition-all hover:bg-red-100 disabled:opacity-30"
                  >
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase">Khóa</span>
                  </button>
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 1 })}
                    disabled={selectedSeats.length === 0}
                    className="flex flex-grow cursor-pointer items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-30"
                  >
                    <Unlock size={14} />
                    <span className="text-[10px] font-black uppercase">Mở</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Matrix Canvas */}
        <div className="min-w-0">
          <div className="admin-seat-map-canvas">
            {/* Screen */}
            <div className="admin-cinema-screen">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span>Màn hình</span>
              </div>
            </div>

            <div className="admin-seat-grid custom-scrollbar">
              <div className="admin-seat-column-labels"><span />{Array.from({ length: template.TongCot }, (_, index) => <b key={index} aria-label={`Cột ${index + 1}`}>{index + 1}</b>)}</div>
              {matrix.map((row) => (
                <div key={row[0]?.Hang} className="admin-seat-grid-row">
                  <b aria-label={`Hàng ${row[0]?.Hang}`}>{row[0]?.Hang}</b>
                  {row.map((seat) => {
                    if (seat.isCovered) return null;
                    if (seat.isAisle) return <span key={seat.MaChiTietSoDo} className="size-9 shrink-0" />;
                    const typeName = getSeatTypeName(seat.MaLoaiGhe);
                    return (
                      <CinemaSeat
                        key={seat.MaChiTietSoDo}
                        label={seat.DoRongCot > 1 ? `${seat.Hang}${seat.Cot}–${seat.Hang}${seat.Cot + seat.DoRongCot - 1}` : `${seat.Hang}${seat.Cot}`}
                        showLabel={false}
                        typeName={typeName}
                        state={seat.KhaDung === 0 ? 'locked' : 'available'}
                        selected={selectedSeats.includes(seat.MaChiTietSoDo)}
                        compact
                        className={seat.KhaDung === 0 ? 'admin-seat--locked' : getAdminSeatClassName(typeName)}
                        title={`Ghế ${seat.DoRongCot > 1 ? `${seat.Hang}${seat.Cot}–${seat.Hang}${seat.Cot + seat.DoRongCot - 1}` : `${seat.Hang}${seat.Cot}`} · ${typeName}`}
                        onClick={(event) => handleSeatClick(seat.MaChiTietSoDo, event)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <SeatLegend
              className="mt-10"
              items={[
                { label: 'Thường', typeName: 'Thường' },
                { label: 'VIP', typeName: 'VIP' },
                { label: 'Sweetbox', typeName: 'Sweetbox' },
                { label: 'Đã khóa', typeName: 'Thường', state: 'locked' },
              ]}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SeatMaps;
