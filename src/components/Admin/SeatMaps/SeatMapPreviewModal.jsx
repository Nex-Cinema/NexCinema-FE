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
    {preview?.error ? <p className="p-6 text-sm text-red-600">{preview.error}</p> : !preview ? null : <div className="p-4"><div className="mb-5 flex justify-between text-sm text-neutral-600"><span>{template.TongHang} hàng × {template.TongCot} cột</span><span>{preview.stats.units} đơn vị ghế · {preview.stats.capacity} chỗ ngồi</span></div><div className="overflow-x-auto pb-3"><div className="admin-seat-preview-grid"><div className="admin-cinema-screen"><div><span>Màn hình</span></div></div><div className="admin-seat-column-labels"><span />{Array.from({ length: Number(template.TongCot) }, (_, col) => <b key={col} aria-label={`Cột ${col + 1}`}>{col + 1}</b>)}</div>{Array.from({ length: Number(template.TongHang) }, (_, row) => <div key={row} className="admin-seat-grid-row"><b aria-label={`Hàng ${String.fromCharCode(65 + row)}`}>{String.fromCharCode(65 + row)}</b>{Array.from({ length: Number(template.TongCot) }, (_, col) => { const pair = preview.structure.couples.find((item) => item.row === row + 1 && item.startCol === col + 1); const covered = preview.structure.couples.some((item) => item.row === row + 1 && item.startCol + 1 === col + 1); if (covered) return null; if (isAislePosition(preview.structure, row, col)) return <span key={col} className="size-9 shrink-0" />; const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}${pair ? `–${String.fromCharCode(65 + row)}${col + 2}` : ''}`; return <CinemaSeat key={col} compact disabled showLabel={false} label={seatLabel} title={`Ghế ${seatLabel}`} typeName={pair ? 'Sweetbox' : 'Thường'} />; })}</div>)}</div></div></div>}
  </Modal>;
};
export default SeatMapPreviewModal;
