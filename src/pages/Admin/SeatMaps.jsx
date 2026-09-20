import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AdminLayout from '../../components/Admin/Layout/AdminLayout';
import adminService from '../../services/adminService';
import { Lock, Unlock, Save } from 'lucide-react';
import { showSuccess, showError } from '../../utils/toastHelper';
import AdminPageHeader from '../../components/Admin/Common/AdminPageHeader';
import AdminButton from '../../components/Admin/Common/AdminButton';
import { CinemaSeat, SeatLegend } from '../../components/Seats/SeatVisuals';

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
              KhaDung: seat.KhaDung
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
        const baseSeat = {
          MaChiTietSoDo: seatId,
          MaSoDoGhe: room.MaSoDoGhe,
          MaLoaiGhe: seatTypes[0]?.MaLoaiGhe || 'LG01',
          Hang: rowChar,
          Cot: c + 1,
          KhaDung: 1,
          isAisle
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Toolbox */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Chỉnh sửa vùng chọn</h3>
            <p className="text-[10px] text-slate-500 mb-4 italic leading-relaxed">Giữ Shift để chọn nhiều ghế cùng lúc.</p>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Loại ghế</label>
                <div className="grid grid-cols-1 gap-2">
                  {seatTypes.map(type => (
                    <button
                      key={type.MaLoaiGhe}
                      onClick={() => updateSelectedSeats({ MaLoaiGhe: type.MaLoaiGhe })}
                      disabled={selectedSeats.length === 0}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all group cursor-pointer"
                    >
                      <span className="text-sm font-bold text-slate-300 group-hover:text-white">{type.TenLoaiGhe}</span>
                      <CinemaSeat label="" typeName={type.TenLoaiGhe} compact disabled className="pointer-events-none !h-6 !w-8" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trạng thái vận hành</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 0 })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Lock size={14} />
                    <span className="text-[10px] font-black uppercase">Khóa</span>
                  </button>
                  <button
                    onClick={() => updateSelectedSeats({ KhaDung: 1 })}
                    disabled={selectedSeats.length === 0}
                    className="flex-grow flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 disabled:opacity-30 transition-all cursor-pointer"
                  >
                    <Unlock size={14} />
                    <span className="text-[10px] font-black uppercase">Mở</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Stats */}
          {selectedSeats.length > 0 && (
            <div className="bg-white/[0.04] border border-red-500/20 rounded-3xl p-6 animate-in fade-in slide-in-from-bottom-4">
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Đang chọn</span>
              <div className="mt-2 text-2xl font-black text-white">{selectedSeats.length} <span className="text-sm font-bold text-slate-500">ghế</span></div>
            </div>
          )}
        </div>

        {/* Matrix Canvas */}
        <div className="lg:col-span-9">
          <div className="admin-seat-map-canvas">
            {/* Screen */}
            <div className="admin-cinema-screen">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span>Màn hình</span>
              </div>
            </div>

            <div 
              className="admin-seat-grid custom-scrollbar"
              style={{ gridTemplateColumns: `repeat(${template.TongCot}, minmax(0, 1fr))` }}
            >
              {matrix.flat().map((seat) => {
                if (seat.isAisle) {
                  return (
                    <div key={seat.MaChiTietSoDo} className="w-9 h-9 shrink-0"></div>
                  );
                }
                return (
                  <CinemaSeat
                    key={seat.MaChiTietSoDo}
                    label={`${seat.Hang}${seat.Cot}`}
                    typeName={getSeatTypeName(seat.MaLoaiGhe)}
                    state={seat.KhaDung === 0 ? 'locked' : 'available'}
                    selected={selectedSeats.includes(seat.MaChiTietSoDo)}
                    compact
                    onClick={(event) => handleSeatClick(seat.MaChiTietSoDo, event)}
                  />
                );
              })}
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
