const UUID_REGEX_STR = '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}';
const STRICT_UUID_REGEX = new RegExp(`^${UUID_REGEX_STR}$`, 'i');
const STRICT_QR_UUID_REGEX = new RegExp(`^QR_(${UUID_REGEX_STR})$`, 'i');
const GLOBAL_QR_UUID_REGEX = new RegExp(`QR_(${UUID_REGEX_STR})`, 'gi');

/**
 * Normalizes an admission QR input string.
 *
 * Rules:
 * - Accept canonical QR_<UUID> case-insensitively and return canonical "QR_<lowercase-uuid>".
 * - Accept a bare UUID and prefix it with "QR_".
 * - Accept a pasted URL or surrounding text containing exactly one QR_<UUID> token.
 * - Enforces UUID versions 1-5 and variant [89ab] per backend contract.
 * - Reject empty or malformed input with a clear Vietnamese message.
 *
 * @param {string} input - Raw QR string or manual input.
 * @returns {string} Normalized QR payload (e.g., 'QR_123e4567-e89b-12d3-a456-426614174000').
 * @throws {Error} If empty, invalid, or ambiguous.
 */
export const normalizeAdmissionQr = (input) => {
  if (typeof input !== 'string' || !input.trim()) {
    throw new Error('Vui lòng nhập hoặc quét mã QR soát vé.');
  }

  const trimmed = input.trim();

  // 1. Check exact QR_<UUID>
  const exactQrMatch = trimmed.match(STRICT_QR_UUID_REGEX);
  if (exactQrMatch) {
    return `QR_${exactQrMatch[1].toLowerCase()}`;
  }

  // 2. Check exact bare UUID
  const exactUuidMatch = trimmed.match(STRICT_UUID_REGEX);
  if (exactUuidMatch) {
    return `QR_${trimmed.toLowerCase()}`;
  }

  // 3. Check for embedded QR_<UUID> in URL or text
  const qrMatches = [...trimmed.matchAll(GLOBAL_QR_UUID_REGEX)];
  if (qrMatches.length === 1) {
    return `QR_${qrMatches[0][1].toLowerCase()}`;
  }

  if (qrMatches.length > 1) {
    throw new Error('Nội dung chứa nhiều mã QR. Vui lòng chỉ cung cấp một mã vé duy nhất.');
  }

  throw new Error('Mã QR không đúng định dạng vé hợp lệ.');
};
