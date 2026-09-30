import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Admin exposes the counter-sale flow for cash and PayOS', () => {
  const app = read('src/App.jsx');
  const sidebar = read('src/components/Admin/Layout/AdminSidebar.jsx');
  const page = read('src/pages/Admin/CounterSales.jsx');
  const service = read('src/services/admin/counterSaleService.js');

  assert.match(app, /\/admin\/counter-sales/);
  assert.match(sidebar, /Bán vé tại quầy/);
  assert.match(page, /TIEN_MAT/);
  assert.match(page, /PAYOS/);
  assert.match(page, /QRCodeSVG/);
  assert.match(service, /\/admin\/ban-ve-tai-quay/);
});

test('requested decorative gateway and seat-selection summaries are removed', () => {
  const gateways = read('src/pages/Admin/PaymentGateways.jsx');
  const seatMaps = read('src/pages/Admin/SeatMaps.jsx');

  assert.doesNotMatch(gateways, /Không lưu secret|Callback rõ ràng|Chặn lỗi sớm/);
  assert.doesNotMatch(gateways, /gateway\.transactions/);
  assert.doesNotMatch(seatMaps, /Vùng đang chọn/);
});
