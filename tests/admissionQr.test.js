import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeAdmissionQr } from '../src/utils/admissionQr.js';

test('normalizeAdmissionQr - valid canonical QR_<UUID>', () => {
  const uuid = '123e4567-e89b-12d3-a456-426614174000';
  assert.equal(normalizeAdmissionQr(`QR_${uuid}`), `QR_${uuid}`);
  assert.equal(normalizeAdmissionQr(`qr_${uuid}`), `QR_${uuid}`);
  assert.equal(normalizeAdmissionQr(`Qr_${uuid.toUpperCase()}`), `QR_${uuid}`);
});

test('normalizeAdmissionQr - valid bare UUID', () => {
  const uuid = '123e4567-e89b-12d3-a456-426614174000';
  assert.equal(normalizeAdmissionQr(uuid), `QR_${uuid}`);
  assert.equal(normalizeAdmissionQr(uuid.toUpperCase()), `QR_${uuid}`);
});

test('normalizeAdmissionQr - URL or surrounding text containing exactly one QR_<UUID>', () => {
  const uuid = '123e4567-e89b-12d3-a456-426614174000';
  assert.equal(
    normalizeAdmissionQr(`https://nexcinema.vn/check-in?code=QR_${uuid}`),
    `QR_${uuid}`
  );
  assert.equal(
    normalizeAdmissionQr(`Ticket info: QR_${uuid} Please present at gate`),
    `QR_${uuid}`
  );
  assert.equal(
    normalizeAdmissionQr(`https://example.com/tickets/qr_${uuid.toUpperCase()}`),
    `QR_${uuid}`
  );
});

test('normalizeAdmissionQr - rejects empty or whitespace input', () => {
  assert.throws(
    () => normalizeAdmissionQr(''),
    { message: 'Vui lòng nhập hoặc quét mã QR soát vé.' }
  );
  assert.throws(
    () => normalizeAdmissionQr('   '),
    { message: 'Vui lòng nhập hoặc quét mã QR soát vé.' }
  );
  assert.throws(
    () => normalizeAdmissionQr(null),
    { message: 'Vui lòng nhập hoặc quét mã QR soát vé.' }
  );
  assert.throws(
    () => normalizeAdmissionQr(undefined),
    { message: 'Vui lòng nhập hoặc quét mã QR soát vé.' }
  );
});

test('normalizeAdmissionQr - rejects malformed or invalid inputs', () => {
  assert.throws(
    () => normalizeAdmissionQr('invalid-token'),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
  assert.throws(
    () => normalizeAdmissionQr('QR_12345'),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
});

test('normalizeAdmissionQr - rejects UUID with invalid version (not 1-5) or variant (not 8/9/a/b)', () => {
  // Version 0 or 6
  const invalidVersion0 = '123e4567-e89b-02d3-a456-426614174000';
  const invalidVersion6 = '123e4567-e89b-62d3-a456-426614174000';
  // Variant c, d, e, f, 0, 7
  const invalidVariantC = '123e4567-e89b-12d3-c456-426614174000';
  const invalidVariant0 = '123e4567-e89b-12d3-0456-426614174000';

  assert.throws(
    () => normalizeAdmissionQr(`QR_${invalidVersion0}`),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
  assert.throws(
    () => normalizeAdmissionQr(`QR_${invalidVersion6}`),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
  assert.throws(
    () => normalizeAdmissionQr(`QR_${invalidVariantC}`),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
  assert.throws(
    () => normalizeAdmissionQr(`QR_${invalidVariant0}`),
    { message: 'Mã QR không đúng định dạng vé hợp lệ.' }
  );
});

test('normalizeAdmissionQr - rejects text with multiple QR_<UUID> tokens', () => {
  const u1 = '123e4567-e89b-12d3-a456-426614174000';
  const u2 = '987fcdeb-51a2-43f7-9abc-def012345678';
  assert.throws(
    () => normalizeAdmissionQr(`QR_${u1} and QR_${u2}`),
    { message: 'Nội dung chứa nhiều mã QR. Vui lòng chỉ cung cấp một mã vé duy nhất.' }
  );
});
