import { useMemo } from 'react';
import Modal from '../Common/Modal';

const parseSeatMapStructure = (structure) => {
  if (!structure) return { aisles: { rows: [], cols: [] } };
  try {
    return typeof structure === 'string' ? JSON.parse(structure) : structure;
  } catch {
    return { aisles: { rows: [], cols: [] } };
  }
};

const buildPreviewMatrix = (template) => {
  if (!template) return [];

  const structure = parseSeatMapStructure(template.CauTruc);
  const aisleRows = structure?.aisles?.rows || [];
  const aisleColumns = structure?.aisles?.cols || [];
  const customAisles = structure?.aisles?.custom || [];

  return Array.from({ length: template.TongHang }, (_, rowIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    const customRow = customAisles.find((item) => item.row === rowIndex);

    return Array.from({ length: template.TongCot }, (_, columnIndex) => ({
      id: `${rowLabel}${columnIndex + 1}`,
      isAisle:
        aisleColumns.includes(columnIndex + 1)
        || aisleRows.includes(rowIndex + 1)
        || Boolean(customRow?.cols?.includes(columnIndex) || customRow?.cols?.includes(columnIndex + 1)),
    }));
  });
};

const SeatMapPreviewModal = ({ template, onClose }) => {
  const previewMatrix = useMemo(() => buildPreviewMatrix(template), [template]);

  return (
    <Modal isOpen={Boolean(template)} onClose={onClose} title={`Xem trước: ${template?.TenSoDo || template?.MaSoDoGhe || ''}`}>
      <div className="flex flex-col items-center p-4 sm:p-8">
        <div className="admin-template-screen">
          <span>Màn hình</span>
        </div>

        <div
          className="admin-template-seat-grid custom-scrollbar"
          style={{ gridTemplateColumns: `repeat(${template?.TongCot || 1}, minmax(0, 1fr))` }}
        >
          {previewMatrix.flat().map((cell) => (
            <div
              key={cell.id}
              className={cell.isAisle ? 'admin-template-seat admin-template-seat--aisle' : 'admin-template-seat'}
            >
              {!cell.isAisle && cell.id}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default SeatMapPreviewModal;
