import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let server;
let SeatMapPreviewModal;
let SeatMapTemplateModal;
let validateSeatMap;

const emptyStructure = {
  aisles: { rows: [], cols: [], custom: [] },
  couples: [],
};

before(async () => {
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  SeatMapPreviewModal = (await server.ssrLoadModule('/src/components/Admin/SeatMaps/SeatMapPreviewModal.jsx')).default;
  SeatMapTemplateModal = (await server.ssrLoadModule('/src/components/Admin/SeatMaps/SeatMapTemplateModal.jsx')).default;
  validateSeatMap = (await server.ssrLoadModule('/src/utils/seatMapHelper.js')).validateSeatMap;
});

after(async () => {
  await server?.close();
});

test('seat-map dimensions allow 15 by 15 and reject larger maps', () => {
  assert.equal(validateSeatMap({ rows: 15, cols: 15, structure: emptyStructure }), '');
  assert.match(validateSeatMap({ rows: 16, cols: 15, structure: emptyStructure }), /1 đến 15/);

  const html = renderToStaticMarkup(createElement(SeatMapTemplateModal, {
    isOpen: true,
    editingTemplate: null,
    formData: {
      TenSoDo: 'Quá lớn',
      TongHang: 16,
      TongCot: 15,
      CauTruc: JSON.stringify(emptyStructure),
      KhaDung: 1,
    },
    onChange() {},
    onSubmit() {},
    onClose() {},
    isSubmitting: false,
    errors: {},
  }));

  assert.match(html, /Số hàng và số cột phải là số nguyên từ 1 đến 15/);
  assert.match(html, /type="submit" disabled=""/);
});

test('seat-map preview keeps coordinates on external axes and seat faces blank', () => {
  const html = renderToStaticMarkup(createElement(SeatMapPreviewModal, {
    template: {
      TenSoDo: 'Demo 2 × 2',
      TongHang: 2,
      TongCot: 2,
      CauTruc: JSON.stringify(emptyStructure),
    },
    onClose() {},
  }));

  assert.match(html, /aria-label="Cột 1"/);
  assert.match(html, /aria-label="Cột 2"/);
  assert.match(html, /aria-label="Hàng A"/);
  assert.match(html, /aria-label="Hàng B"/);
  assert.match(html, /aria-label="Ghế A1, Thường"/);
  assert.doesNotMatch(html, />A1</);
  assert.doesNotMatch(html, />B2</);
});
