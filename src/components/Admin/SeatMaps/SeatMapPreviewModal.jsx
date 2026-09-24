import { useMemo } from 'react';
import { CinemaSeat } from '../../Seats/SeatVisuals';
import { getSeatMapStats, isAislePosition, parseSeatMapStructure, validateSeatMap } from '../../../utils/seatMapHelper';
import Modal from '../Common/Modal';

const SeatMapPreviewModal = ({ template, onClose }) => {
  const preview = useMemo(() => {
    if (!template) return null;
    try {
      const structure = parseSeatMapStructure(template.CauTruc);
      const error = validateSeatMap({ rows: Number(template.TongHang), cols: Number(template.TongCot), structure });
      if (error) return { error };
      return { structure, stats: getSeatMapStats(Number(template.TongHang), Number(template.TongCot), structure) };
    } catch (error) { return { error: error.message || 'Cấu trúc không hợp lệ.' }; }
  }, [template]);

  if (!template) return null;

  return <Modal isOpen={Boolean(template)} onClose={onClose} title={`Xem trước: ${template?.TenSoDo || ''}`}>
    {preview?.error ? <p className="p-6 text-sm text-red-600">{preview.error}</p> : !preview ? null : <div className="p-4"><div className="mb-5 flex justify-between text-sm text-neutral-600"><span>{template.TongHang} hàng × {template.TongCot} cột</span><span>{preview.stats.units} đơn vị ghế · {preview.stats.capacity} chỗ ngồi</span></div><div className="overflow-x-auto pb-3"><div className="mx-auto w-max"><div className="mb-6 border-b-2 border-neutral-300 pb-2 text-center text-xs text-neutral-500">Màn hình</div>{Array.from({ length: Number(template.TongHang) }, (_, row) => <div key={row} className="mb-2 flex items-center gap-3"><span className="w-5 text-xs text-neutral-500">{String.fromCharCode(65 + row)}</span><div className="flex gap-2">{Array.from({ length: Number(template.TongCot) }, (_, col) => { const pair = preview.structure.couples.find((item) => item.row === row + 1 && item.startCol === col + 1); const covered = preview.structure.couples.some((item) => item.row === row + 1 && item.startCol + 1 === col + 1); if (covered) return null; if (isAislePosition(preview.structure, row, col)) return <span key={col} className="size-9 shrink-0" />; return <CinemaSeat key={col} compact disabled label={`${String.fromCharCode(65 + row)}${col + 1}${pair ? `–${String.fromCharCode(65 + row)}${col + 2}` : ''}`} typeName={pair ? 'Sweetbox' : 'Thường'} />; })}</div></div>)}</div></div></div>}
  </Modal>;
};
export default SeatMapPreviewModal;
