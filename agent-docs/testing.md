# testing.md — Cinema Booking System Frontend

Chiến lược testing cho dự án Cinema Booking System.

---

## 1. Testing Philosophy

Dự án ưu tiên:
1. **Manual testing** — Ưu tiên trong giai đoạn prototype.
2. **Integration test** — Test flow đặt vé end-to-end quan trọng hơn unit test từng component nhỏ.
3. **Unit test** — Tập trung vào utility functions và pure logic (formatters, helpers).

> Không yêu cầu 100% test coverage. Tập trung vào **critical paths** của hệ thống đặt vé.

---

## 2. Critical Paths cần Test

### 2.1 Booking Flow (QUAN TRỌNG NHẤT)

#### Case 1 — Từ Homepage
```
/ → click "Đặt vé" → /movie/:id → chọn suất chiếu → chọn ghế → /checkout → thanh toán
```

#### Case 2 — Từ Movie Card
```
/movies/now-showing → click "Mua vé" → chọn suất chiếu → chọn ghế → /checkout
```

#### Case 3 — Từ Movie Detail (suất chiếu cụ thể)
```
/movie/:id → click suất chiếu cụ thể → chọn ghế (bỏ qua chọn suất chiếu)
```

**Phải kiểm tra:**
- [ ] Đổi suất chiếu ở màn hình chọn ghế → sơ đồ ghế reload, ghế đã chọn bị reset.
- [ ] Ghế đã đặt (DA_DAT) không thể click.
- [ ] Ghế đang giữ (DANG_GIU) không thể click.
- [ ] Không cho phép tiến đến Checkout nếu chưa chọn ghế.
- [ ] Auth guard: nếu chưa đăng nhập → redirect `/login` khi bấm "Tiếp tục thanh toán".

### 2.2 Payment Flow

```
/checkout → chọn VNPay → redirect sang VNPay → callback /payment/vnpay-return
/checkout → chọn PayOS → hiển thị QR → poll status → kết quả
```

**Phải kiểm tra:**
- [ ] Hiển thị đúng số tiền tổng = sum(GiaVeTinhToan) của các ghế đã chọn.
- [ ] VNPay: redirect URL hợp lệ.
- [ ] VNPay return: parse đúng `vnp_ResponseCode`, hiển thị kết quả đúng.
- [ ] PayOS: QR hiển thị, polling dừng khi status = `PAID` hoặc `CANCELLED`.
- [ ] Trạng thái PENDING / PROCESSING / SUCCESS / FAILED / CANCELLED hiển thị đúng badge.

### 2.3 Authentication

- [ ] Đăng nhập thành công → lưu token → redirect đúng (theo role).
- [ ] Đăng nhập thất bại → hiển thị lỗi rõ ràng.
- [ ] Refresh token flow: access token hết hạn → auto refresh → tiếp tục request.
- [ ] Refresh token thất bại → xóa storage → redirect `/login`.
- [ ] Đăng xuất → xóa toàn bộ localStorage → redirect `/login`.

### 2.4 Seat Map

- [ ] Sơ đồ ghế render đúng layout (đúng số hàng, số cột, vị trí ghế).
- [ ] Ghế Thường / VIP / Đôi hiển thị đúng màu sắc.
- [ ] Ghế Đôi chiếm 2 cột chiều ngang.
- [ ] Aisle (lối đi) hiển thị là khoảng trống.

### 2.5 Admin Portal

- [ ] CRUD phim: tạo, sửa, xóa phim — hiển thị đúng danh sách sau thao tác.
- [ ] Tạo suất chiếu: chọn phim + phòng + ngày giờ → không conflict.
- [ ] Xem thống kê: charts render với dữ liệu thực.

---

## 3. Test Scenarios — Seat Hold Timer

| Scenario | Expected |
|---|---|
| User giữ ghế thành công | Timer bắt đầu đếm ngược 10:00 |
| User idle 10 phút | Timer về 0:00, hiển thị thông báo hết hạn |
| User đổi suất chiếu | Timer reset, ghế cũ được hủy giữ |
| API giữ ghế thất bại | Toast error, ghế không được chọn, sơ đồ reload |

---

## 4. Manual Test Checklist

Chạy checklist này trước khi tạo PR:

### UI / Responsive
- [ ] Trang chủ hiển thị đúng trên mobile (375px) và desktop (1280px+).
- [ ] Navbar collapse đúng trên mobile.
- [ ] Sơ đồ ghế có thể scroll ngang trên mobile khi rạp nhiều cột.
- [ ] Modal / dialog hiển thị đúng trên mobile.

### Loading & Error States
- [ ] Mọi page hiển thị loading spinner khi đang fetch.
- [ ] Hiển thị error message khi API fail.
- [ ] Hiển thị empty state khi không có dữ liệu.

### Toast Notifications
- [ ] Success action hiển thị toast xanh.
- [ ] Error action hiển thị toast đỏ.
- [ ] Toast không che khuất nút bấm quan trọng.

### Auth
- [ ] Các route protected chuyển hướng đúng nếu chưa đăng nhập.
- [ ] Khách hàng không truy cập được `/staff` hoặc `/admin`.
- [ ] Nhân viên không truy cập được `/admin`.

---

## 5. Utility Function Tests (Unit)

Các hàm trong `src/utils/` nên được test:

### `formatHelper.js`
```js
// formatVND
formatVND(120000)   // "120.000 ₫"
formatVND(0)        // "0 ₫"
formatVND(1500000)  // "1.500.000 ₫"

// formatTime (HH:mm)
formatTime('2026-01-15T08:30:00') // "08:30"
```

### `statusHelper.js`
```js
// Payment status → badge class
getPaymentStatusClass('SUCCESS')    // 'badge-success'
getPaymentStatusClass('FAILED')     // 'badge-danger'
getPaymentStatusClass('PENDING')    // 'badge-warning'
getPaymentStatusClass('CANCELLED')  // 'badge-muted'
```

### `showtimeHelper.js`
```js
// Nhóm showtimes theo ngày
groupShowtimesByDate(showtimes)
// { '2026-01-15': [...], '2026-01-16': [...] }
```

---

## 6. Running Tests

Hiện tại dự án chưa có test runner được cấu hình sẵn.  
Nếu muốn thêm unit test:

```bash
# Cài Vitest (khuyến nghị vì đồng bộ với Vite)
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom

# Thêm vào vite.config.js
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})

# Chạy test
npx vitest
npx vitest run          # CI mode
npx vitest --coverage   # Coverage report
```

---

## 7. Không cần test

- Animation / transition CSS.
- Static content (text, hình ảnh) không có logic.
- Third-party library internals (Recharts, React Player).
- Môi trường dev server (Vite HMR).

---

## 8. Lưu ý đặc biệt

### Test tính năng đặt vé cần backend chạy
Booking, payment, seat map đều cần backend API thực.  
Nếu backend chưa sẵn:
- Dùng `simulatedCheckout` endpoint (giả lập kết quả thanh toán).
- Dùng `adminMockData.js` và `constants/movies.js` cho static data.

### Không mock toàn bộ axios trong test component phức tạp
Thay vào đó, test manual với backend local hoặc staging.
