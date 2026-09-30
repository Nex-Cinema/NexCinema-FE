const EMPTY_STRUCTURE = { aisles: { rows: [], cols: [], custom: [] }, couples: [] };

export const parseSeatMapStructure = (value) => {
  if (!value) return structuredClone(EMPTY_STRUCTURE);
  const parsed = typeof value === 'string' ? JSON.parse(value) : value;
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new TypeError('Cấu trúc phải là một JSON object.');
  const aisles = parsed.aisles;
  if (aisles != null && (typeof aisles !== 'object' || Array.isArray(aisles))) throw new TypeError('aisles phải là một object.');
  if (parsed.couples != null && !Array.isArray(parsed.couples)) throw new TypeError('couples phải là một mảng.');
  if (aisles?.rows != null && !Array.isArray(aisles.rows)) throw new TypeError('aisles.rows phải là một mảng.');
  if (aisles?.cols != null && !Array.isArray(aisles.cols)) throw new TypeError('aisles.cols phải là một mảng.');
  if (aisles?.custom != null && !Array.isArray(aisles.custom)) throw new TypeError('aisles.custom phải là một mảng.');
  return {
    ...parsed,
    aisles: {
      ...(aisles || {}),
      rows: Array.isArray(aisles?.rows) ? aisles.rows : [],
      cols: Array.isArray(aisles?.cols) ? aisles.cols : [],
      custom: Array.isArray(aisles?.custom) ? aisles.custom : [],
    },
    couples: Array.isArray(parsed.couples) ? parsed.couples : [],
  };
};

export const parseNumberList = (value) => {
  if (value == null) return [];
  const parts = String(value)
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return parts.map((item) => Number(item));
};

export const isAislePosition = (structure, rowIndex, columnIndex) => {
  const customRow = structure.aisles.custom.find((item) => item.row === rowIndex);
  return structure.aisles.rows.includes(rowIndex + 1)
    || structure.aisles.cols.includes(columnIndex + 1)
    || Boolean(customRow?.cols?.includes(columnIndex) || customRow?.cols?.includes(columnIndex + 1));
};

export const validateSeatMap = ({ rows, cols, structure }) => {
  if (!Number.isInteger(rows) || rows < 1 || rows > 15 || !Number.isInteger(cols) || cols < 1 || cols > 15) {
    return 'Số hàng và số cột phải là số nguyên từ 1 đến 15.';
  }
  if (!structure || typeof structure !== 'object' || !structure.aisles || !Array.isArray(structure.aisles.rows) || !Array.isArray(structure.aisles.cols) || !Array.isArray(structure.aisles.custom) || !Array.isArray(structure.couples)) return 'Các trường aisles và couples phải là danh sách.';
  if (structure.aisles.rows.some((row) => !Number.isInteger(row) || row < 1 || row > rows) || structure.aisles.cols.some((col) => !Number.isInteger(col) || col < 1 || col > cols)) return 'Vị trí lối đi phải là số nguyên nằm trong kích thước sơ đồ.';
  if (structure.aisles.custom.some((item) => !item || !Number.isInteger(item.row) || item.row < 0 || item.row >= rows || !Array.isArray(item.cols) || item.cols.some((col) => !Number.isInteger(col) || col < 0 || col > cols))) return 'Lối đi tùy chỉnh không đúng định dạng.';
  const occupied = new Set();
  for (const pair of structure.couples) {
    if (!pair || typeof pair !== 'object') return 'Ghế đôi không đúng định dạng.';
    if (!Number.isInteger(pair.row) || !Number.isInteger(pair.startCol) || pair.row < 1 || pair.row > rows || pair.startCol < 1 || pair.startCol >= cols) return 'Mỗi ghế đôi phải nằm trọn trong sơ đồ.';
    for (const column of [pair.startCol, pair.startCol + 1]) {
      const key = `${pair.row}:${column}`;
      if (occupied.has(key)) return 'Các ghế đôi không được chồng lên nhau.';
      if (isAislePosition(structure, pair.row - 1, column - 1)) return 'Ghế đôi không được đặt trên lối đi.';
      occupied.add(key);
    }
  }
  return '';
};

export const getSeatMapStats = (rows, cols, structure) => {
  let availableCells = 0;
  for (let row = 0; row < rows; row += 1) for (let col = 0; col < cols; col += 1) if (!isAislePosition(structure, row, col)) availableCells += 1;
  return { units: availableCells - structure.couples.length, capacity: availableCells };
};
