import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';

let server;
let client;
let customerService;
let transactionService;
let paymentGatewayService;

const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

before(async () => {
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: () => null } });
  server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' });
  client = (await server.ssrLoadModule('/src/api/axiosClient.js')).default;
  customerService = (await server.ssrLoadModule('/src/services/admin/customerService.js')).default;
  transactionService = (await server.ssrLoadModule('/src/services/admin/transactionService.js')).default;
  paymentGatewayService = await server.ssrLoadModule('/src/services/admin/paymentGatewayService.js');
});

after(async () => {
  await server?.close();
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else delete globalThis.localStorage;
});

const response = (config, data, pagination) => ({
  config,
  status: 200,
  headers: {},
  data: { success: true, data, ...(pagination && { pagination }) },
});

test('customer loader respects the backend page limit and collects every page', async () => {
  const calls = [];
  client.defaults.adapter = async (config) => {
    calls.push(config);
    const page = config.params.page;
    const data = [{ MaTaiKhoan: `customer-${page}`, VaiTro: 'CUSTOMER', HoTen: `Customer ${page}`, KhaDung: true }];
    return response(config, data, { page, limit: 100, total: 2, totalPages: 2 });
  };

  const customers = await customerService.getCustomers();

  assert.deepEqual(customers.map(item => item.MaTaiKhoan), ['customer-1', 'customer-2']);
  assert.equal(calls.length, 2);
  assert.ok(calls.every(call => call.url === '/admin/nguoi-dung'));
  assert.ok(calls.every(call => call.params.limit === 100));
});

test('transaction loader replaces the rejected limit=1000 request with paginated requests', async () => {
  const calls = [];
  client.defaults.adapter = async (config) => {
    calls.push(config);
    const page = config.params.page;
    const booking = {
      MaPhieuDat: `booking-${page}`,
      TongTien: '75000',
      TrangThai: 'DA_THANH_TOAN',
      NgayTao: '2026-09-24T09:00:00.000Z',
      GiaoDichs: [],
      ChiTietDatVes: [],
    };
    return response(config, [booking], { page, limit: 100, total: 2, totalPages: 2 });
  };

  const transactions = await transactionService.getTransactions();

  assert.equal(transactions.length, 2);
  assert.deepEqual(calls.map(call => call.params.page), [1, 2]);
  assert.ok(calls.every(call => call.params.limit === 100));
  assert.ok(calls.every(call => !call.url.includes('limit=1000')));
});

test('payment gateway loader accepts the current non-paginated API envelopes', async () => {
  client.defaults.adapter = async (config) => {
    return response(config, [{ provider: 'PAYOS', label: 'PayOS', enabled: true }]);
  };

  const gateways = await paymentGatewayService.getPaymentGateways();

  assert.equal(gateways[0].provider, 'PAYOS');
});
