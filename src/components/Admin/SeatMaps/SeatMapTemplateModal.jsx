import { useState } from 'react';

import { CinemaSeat } from '../../Seats/SeatVisuals';
import {
  getSeatMapStats,
  isAislePosition,
  parseNumberList,
  parseSeatMapStructure,
  validateSeatMap,
} from '../../../utils/seatMapHelper';
import AdminButton from '../Common/AdminButton';
import FormField from '../Common/FormField';
import Modal from '../Common/Modal';

const SeatMapTemplateModal = ({ isOpen, editingTemplate, formData, onChange, onSubmit, onClose, isSubmitting, errors }) => {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [coupleRow, setCoupleRow] = useState('');
  const [coupleStartCol, setCoupleStartCol] = useState('');
  const initialStructure = (() => { try { return parseSeatMapStructure(formData.CauTruc); } catch { return parseSeatMapStructure(); } })();
  const [aisleRowsDraft, setAisleRowsDraft] = useState(() => Array.isArray(initialStructure.aisles.rows) ? initialStructure.aisles.rows.join(', ') : '');
  const [aisleColsDraft, setAisleColsDraft] = useState(() => Array.isArray(initialStructure.aisles.cols) ? initialStructure.aisles.cols.join(', ') : '');
  const [aislesDirty, setAislesDirty] = useState(false);

  let structure;
  let parseError = '';
  try {
    structure = parseSeatMapStructure(formData.CauTruc);
  } catch (error) {
    parseError = error.message || 'JSON chưa hợp lệ.';
    structure = parseSeatMapStructure();
  }

  const rows = Number(formData.TongHang);
  const cols = Number(formData.TongCot);
  const structureError = parseError || validateSeatMap({ rows, cols, structure });
  const geometryIsSafe = !structureError;
  const stats = geometryIsSafe ? getSeatMapStats(rows, cols, structure) : { units: 0, capacity: 0 };

  const updateStructure = (next) => {
    onChange({ target: { name: 'CauTruc', value: JSON.stringify(next, null, 2) } });
  };

  const structureWithDraftAisles = () => !aislesDirty ? structure : ({
    ...structure,
    aisles: {
      ...structure.aisles,
      rows: parseNumberList(aisleRowsDraft),
      cols: parseNumberList(aisleColsDraft),
    },
  });

  const commitAisles = () => {
    const next = structureWithDraftAisles();
    if (!validateSeatMap({ rows, cols, structure: next })) updateStructure(next);
  };

  const addCouple = () => {
    if (!geometryIsSafe) return;
    const next = {
      ...structureWithDraftAisles(),
      couples: [...structure.couples, { row: Number(coupleRow), startCol: Number(coupleStartCol) }],
    };
    if (!validateSeatMap({ rows, cols, structure: next })) {
      updateStructure(next);
      setCoupleRow('');
      setCoupleStartCol('');
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const next = structureWithDraftAisles();
    const error = parseError || validateSeatMap({ rows, cols, structure: next });
    if (!error) {
      onSubmit(event, { ...formData, CauTruc: JSON.stringify(next, null, 2) });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingTemplate ? 'Cập nhật sơ đồ mẫu' : 'Tạo sơ đồ mẫu mới'}>
      <form onSubmit={submit} className="space-y-5">
        <FormField label="Tên sơ đồ" required>
          <input name="TenSoDo" required value={formData.TenSoDo || ''} onChange={onChange} placeholder="Ví dụ: Phòng tiêu chuẩn 5 × 6" />
        </FormField>

        <div className="admin-form-grid">
          <FormField label="Số hàng" required><input type="number" name="TongHang" min="1" max="15" required value={formData.TongHang} onChange={onChange} /></FormField>
          <FormField label="Số cột" required><input type="number" name="TongCot" min="1" max="15" required value={formData.TongCot} onChange={onChange} /></FormField>
        </div>

        <div className="admin-form-grid">
          <FormField label="Hàng làm lối đi" helperText="Các số cách nhau bằng dấu phẩy.">
            <input value={aisleRowsDraft} onChange={(event) => { setAisleRowsDraft(event.target.value); setAislesDirty(true); }} onBlur={commitAisles} placeholder="Ví dụ: 4" />
          </FormField>
          <FormField label="Cột làm lối đi" helperText="Các số cách nhau bằng dấu phẩy.">
            <input value={aisleColsDraft} onChange={(event) => { setAisleColsDraft(event.target.value); setAislesDirty(true); }} onBlur={commitAisles} placeholder="Ví dụ: 3, 8" />
          </FormField>
        </div>

        {geometryIsSafe && (
          <div className="rounded-xl border border-neutral-200 p-4">
            <p className="mb-3 text-sm font-semibold text-neutral-900">Ghế đôi</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input type="number" min="1" max={rows} value={coupleRow} onChange={(event) => setCoupleRow(event.target.value)} placeholder="Hàng" aria-label="Hàng ghế đôi" />
              <input type="number" min="1" max={Math.max(1, cols - 1)} value={coupleStartCol} onChange={(event) => setCoupleStartCol(event.target.value)} placeholder="Cột bắt đầu" aria-label="Cột bắt đầu ghế đôi" />
              <AdminButton type="button" variant="outline" onClick={addCouple}>Thêm</AdminButton>
            </div>
            {structure.couples.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{structure.couples.map((pair, index) => <button type="button" key={`${pair.row}-${pair.startCol}-${index}`} className="rounded-lg border border-neutral-200 px-3 py-1 text-xs" onClick={() => updateStructure({ ...structure, couples: structure.couples.filter((_, itemIndex) => itemIndex !== index) })}>Hàng {pair.row}, cột {pair.startCol}–{pair.startCol + 1} ×</button>)}</div>}
          </div>
        )}

        {geometryIsSafe && (
          <div className="rounded-xl border border-neutral-200 p-4">
            <div className="mb-3 flex items-center justify-between"><strong className="text-sm">Xem trước</strong><span className="text-xs text-neutral-500">{stats.units} đơn vị ghế · {stats.capacity} chỗ ngồi</span></div>
            <div className="overflow-x-auto"><div className="admin-seat-preview-grid"><div className="admin-seat-column-labels"><span />{Array.from({ length: cols }, (_, col) => <b key={col} aria-label={`Cột ${col + 1}`}>{col + 1}</b>)}</div>{Array.from({ length: rows }, (_, row) => <div key={row} className="admin-seat-grid-row"><b aria-label={`Hàng ${String.fromCharCode(65 + row)}`}>{String.fromCharCode(65 + row)}</b>{Array.from({ length: cols }, (_, col) => { const pair = structure.couples.find((item) => item.row === row + 1 && item.startCol === col + 1); const covered = structure.couples.some((item) => item.row === row + 1 && item.startCol + 1 === col + 1); if (covered) return null; if (isAislePosition(structure, row, col)) return <span key={col} className="size-9 shrink-0" />; const seatLabel = `${String.fromCharCode(65 + row)}${col + 1}${pair ? `–${String.fromCharCode(65 + row)}${col + 2}` : ''}`; return <CinemaSeat key={col} compact disabled showLabel={false} label={seatLabel} title={`Ghế ${seatLabel}`} typeName={pair ? 'Sweetbox' : 'Thường'} />; })}</div>)}</div></div>
          </div>
        )}

        <button type="button" className="text-sm font-semibold text-neutral-700" onClick={() => setAdvancedOpen((value) => !value)}>{advancedOpen || structureError ? 'Ẩn JSON nâng cao' : 'Mở JSON nâng cao'}</button>
        {(advancedOpen || structureError) && <FormField label="Cấu trúc JSON" helperText="Dành cho lối đi tùy chỉnh và thuộc tính nâng cao."><textarea name="CauTruc" value={formData.CauTruc} onChange={onChange} spellCheck="false" /></FormField>}
        {editingTemplate && <FormField label="Trạng thái"><select name="KhaDung" value={String(formData.KhaDung === true || formData.KhaDung === 1 || formData.KhaDung === '1' ? 1 : 0)} onChange={onChange}><option value="1">Khả dụng</option><option value="0">Chưa khả dụng</option></select></FormField>}
        {(structureError || errors?.submit) && <p className="text-sm text-red-600" role="alert">{structureError || errors.submit}</p>}
        <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4"><AdminButton type="button" variant="outline" onClick={onClose}>Hủy</AdminButton><AdminButton type="submit" disabled={isSubmitting || Boolean(structureError)}>{isSubmitting ? 'Đang lưu…' : 'Lưu mẫu'}</AdminButton></div>
      </form>
    </Modal>
  );
};

export default SeatMapTemplateModal;
