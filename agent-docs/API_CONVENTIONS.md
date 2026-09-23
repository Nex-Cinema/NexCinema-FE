# API_CONVENTIONS.md — Cinema Booking System Frontend

Tài liệu quy ước API layer cho toàn bộ frontend.

---

## 1. HTTP Client Overview

Dự án có **hai** axios instance với mục đích khác nhau:

| Instance | File | Dùng cho |
|---|---|---|
| `axiosClient` | `src/api/axiosClient.js` | Authenticated requests (CUSTOMER, STAFF, ADMIN) |
| `axiosPublic` | `src/api/axiosPublic.js` | Public requests (không cần token — danh sách phim, suất chiếu) |

```js
// ✅ ĐÚNG — Authenticated endpoint
import axiosClient from '@/api/axiosClient';
const profile = await axiosClient.get('/tai-khoan/me');

// ✅ ĐÚNG — Public endpoint
import axiosPublic from '@/api/axiosPublic';
const movies = await axiosPublic.get('/phim');

// ❌ SAI — Không dùng fetch() trực tiếp
const res = await fetch('http://localhost:5000/api/v1/phim');
```

---

## 2. Base URL

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Cấu hình trong `.env` (xem `.env.example`).

---

## 3. Response Shape

Backend trả về một trong hai dạng:

### Dạng 1 — Standard response
```json
{
  "success": true,
  "message": "Thành công",
  "data": { ... }
}
```

### Dạng 2 — Paginated response
```json
{
  "success": true,
  "message": "Thành công",
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 48,
    "limit": 10
  }
}
```

### Interceptor behavior

`axiosClient` interceptor **tự động unwrap**:
- Response standard → trả về `response.data.data`
- Response paginated → trả về `{ data, pagination }`
- `success === false` → throw `Error(message)`

> **Lưu ý:** Trong service layer, kiểm tra kỹ kiểu dữ liệu trả về.  
> Một số endpoint trả về array, một số trả về object.

---

## 4. Authentication & Token Handling

### Token storage
```
localStorage.accessToken   — JWT access token (short-lived)
localStorage.refreshToken  — Refresh token (long-lived)
localStorage.userRole      — 'CUSTOMER' | 'STAFF' | 'ADMIN'
localStorage.userName      — Display name
localStorage.userCode      — Mã nhân viên / mã khách hàng
```

### Auto refresh flow
`axiosClient` có interceptor xử lý **auto refresh token** khi gặp 401:
1. Gọi `POST /auth/refresh-token` với `refreshToken`.
2. Nếu thành công → cập nhật `accessToken` → retry request ban đầu.
3. Nếu thất bại → xóa toàn bộ localStorage → redirect `/login`.
4. Các request 401 khác trong lúc đang refresh → xếp hàng chờ (`failedQueue`).

---

## 5. Error Handling Convention

### Trong API functions (`src/api/*.js`)
Không catch lỗi ở đây — để interceptor xử lý và propagate.

```js
// ✅ ĐÚNG
export const holdSeats = (maSuatChieu, seatIds) =>
  axiosClient.post('/dat-ve/giu-ghe', {
    MaSuatChieu: maSuatChieu,
    DanhSachMaGheSuatChieu: seatIds,
  });
```

### Trong Service layer (`src/services/*.js`)
Có thể transform data, nhưng KHÔNG nuốt lỗi.

```js
// ✅ ĐÚNG — Transform, rethrow
getMovies: async ({ limit = 30, page = 1 } = {}) => {
  const res = await axiosPublic.get('/phim', { params: { limit, page } });
  const items = Array.isArray(res) ? res : res?.data ?? [];
  return items.map(mapMovie);
},
```

### Trong Component / Page
```js
// ✅ ĐÚNG — try/catch + toast
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  try {
    setIsLoading(true);
    const data = await someApiCall();
    setState(data);
  } catch (err) {
    const msg = err?.message || 'Có lỗi xảy ra, vui lòng thử lại.';
    toast.error(msg);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 6. API Modules

### `/src/api/` — Thin API layer (raw axios calls)

| File | Domain | Endpoints chính |
|---|---|---|
| `authApi.js` | Auth | `POST /auth/login`, `/auth/register`, `/auth/logout`, `/auth/refresh-token` |
| `movieApi.js` | Movie | `GET /phim`, `GET /phim/:id` |
| `bookingApi.js` | Booking | `GET /suat-chieu/:id/ghe`, `POST /dat-ve/giu-ghe`, `POST /dat-ve/huy-giu-ghe`, `POST /dat-ve/thanh-toan` |
| `paymentApi.js` | Payment | `POST /payment/payos/create`, `GET /payment/payos/:id/status`, `POST /payment/vnpay/create`, `GET /payment/vnpay/:id/status` |
| `refundApi.js` | Refund | Hoàn vé / hủy đặt vé |
| `accountApi.js` | Account | `GET /tai-khoan/me`, `PUT /tai-khoan/me` |
| `bookingHistoryApi.js` | History | `GET /dat-ve/lich-su` |
| `axiosClient.js` | — | Authenticated HTTP client |
| `axiosPublic.js` | — | Public HTTP client |

### `/src/services/` — Business logic / data transform layer

| File | Dùng cho |
|---|---|
| `clientService.js` | Client-side data fetching: phim, suất chiếu, sơ đồ ghế (dùng `axiosPublic`) |
| `adminService.js` | Admin: CRUD phim, phòng chiếu, nhân sự, ... |
| `admin/movieService.js` | Admin CRUD phim |
| `admin/showtimeService.js` | Admin quản lý suất chiếu |
| `admin/roomService.js` | Admin quản lý phòng chiếu |
| `admin/seatService.js` | Admin quản lý ghế |
| `admin/pricingService.js` | Admin quản lý giá vé |
| `admin/shiftService.js` | Admin quản lý ca làm việc |
| `admin/personnelService.js` | Admin quản lý nhân sự |
| `admin/customerService.js` | Admin quản lý khách hàng |
| `admin/transactionService.js` | Admin xem giao dịch |
| `admin/statsService.js` | Admin dashboard statistics |

---

## 7. Domain Naming — Backend vs Frontend

Backend sử dụng tiếng Việt không dấu:

| Backend field | Frontend alias | Ý nghĩa |
|---|---|---|
| `MaPhim` | `id`, `_id` | ID phim |
| `TenPhim` | `title` | Tên phim |
| `HinhAnh` | `poster_path` | URL poster |
| `NoiDung` | `overview` | Nội dung/mô tả |
| `ThoiLuong` | `runtime` | Thời lượng (phút) |
| `TheLoai` | `genres` (array) | Thể loại |
| `DaoDien` | — | Đạo diễn |
| `DienVien` | `casts` (array) | Diễn viên |
| `Trailer` | `videoUrl` | URL trailer |
| `GioiHanTuoi` | — | Giới hạn tuổi (P, K, T13, T16, T18, C) |
| `NgayKhoiChieu` | `release_date` | Ngày khởi chiếu |
| `MaSuatChieu` | `showId` | ID suất chiếu |
| `GioChieu` | `startTime` | Giờ chiếu (ISO datetime) |
| `MaGheSuatChieu` | — | ID ghế trong suất chiếu |
| `TenGhe` | — | Tên ghế (ví dụ: A3, B7) |
| `TenLoaiGhe` | — | Loại ghế (Thường, VIP, Đôi) |
| `TrangThai` | — | TRONG, DA_DAT, DANG_GIU |
| `GiaVeTinhToan` | — | Giá vé tính toán theo loại, ngày, suất |
| `MaPhieuDat` | — | ID phiếu đặt vé |
| `PhuongThucThanhToan` | — | VNPAY, PAYOS, TIEN_MAT |

---

## 8. Payment API Patterns

### VNPay flow
```
POST /payment/vnpay/create { MaPhieuDat }
  → { paymentUrl: "https://sandbox.vnpayment.vn/..." }
  → Redirect user to paymentUrl
  → User pays → VNPay calls backend callback
  → User redirected to /payment/vnpay-return?vnp_ResponseCode=...
```

### PayOS flow
```
POST /payment/payos/create { MaPhieuDat }
  → { qrCode: "...", checkoutUrl: "...", orderCode: 123 }
  → Show QR code để user quét
  → Poll: GET /payment/payos/:maGiaoDich/status
  → Status: PENDING → PAID / CANCELLED
```

---

## 9. Paginated Requests

```js
// Pattern chuẩn cho paginated API
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

const fetchItems = async () => {
  const res = await adminService.getTransactions({ page, limit: 20 });
  // res = { data: [...], pagination: { currentPage, totalPages, totalItems } }
  setItems(res.data);
  setTotalPages(res.pagination.totalPages);
};
```

---

## 10. Không được làm

- ❌ Gọi API bằng `fetch()` — luôn dùng `axiosClient` hoặc `axiosPublic`.
- ❌ Hardcode base URL trong component — dùng `VITE_API_BASE_URL`.
- ❌ Tự catch và nuốt lỗi trong API layer — để propagate lên component.
- ❌ Gọi authenticated endpoint bằng `axiosPublic`.
- ❌ Thêm endpoint mới mà không cập nhật bảng trong file này.
