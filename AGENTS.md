# AGENTS.md — Cinema Booking System Frontend

> Tài liệu này dành cho **AI Coding Agent** làm việc trong repository `cinema-booking-system-frontend`.  
> Đọc toàn bộ file này trước khi thực hiện bất kỳ task nào.

---

## 1. Business Context

Đây là **website đặt vé xem phim online** phục vụ **một cụm rạp duy nhất**.

**Không** có nghiệp vụ multi-cinema, multi-chain, food & beverage, loyalty points, hay merchandise.

### Người dùng của hệ thống

| Role | Mô tả |
|---|---|
| `CUSTOMER` | Người dùng xem phim, đặt vé online |
| `STAFF` | Nhân viên rạp: bán vé tại quầy, check-in |
| `ADMIN` | Quản trị viên: quản lý phim, suất chiếu, nhân sự, doanh thu |

### Domain model chính

```
Movie → Showtime → Seat → Booking → Payment → Transaction
User → Profile → BookingHistory → Notification
```

---

## 2. Booking Flow — QUAN TRỌNG

Agent phải nắm rõ 3 case của booking flow trước khi code:

### Case 1 — Click "Đặt vé" từ Homepage / Header
```
Chọn phim → Chọn suất chiếu → Chọn ghế → Thanh toán → Xác nhận
```

### Case 2 — Click "Mua vé" từ Movie Card
```
Chọn suất chiếu → Chọn ghế → Thanh toán → Xác nhận
```

### Case 3 — Chọn suất chiếu từ Movie Detail page
```
Chọn ghế → Thanh toán → Xác nhận
```

**Quy tắc ở màn hình Chọn ghế:**
- Người dùng **có thể đổi suất chiếu** ngay tại màn hình chọn ghế.
- Khi đổi suất chiếu, hệ thống **reset ghế đã chọn** và tải lại sơ đồ ghế.
- Chỉ cho phép tiếp tục khi **đã chọn ít nhất 1 ghế hợp lệ**.
- Ghế bị hold sau khi user confirm → backend API `/dat-ve/giu-ghe`.
- Thời gian giữ ghế: **10 phút**.

**Không có:** chọn rạp, chọn đồ ăn, chọn thức uống.

---

## 3. Payment

Chỉ hỗ trợ (prototype):
- **VNPay** — redirect URL, callback `/payment/vnpay-return`
- **PayOS** — QR payment, polling status

Payment flow:
```
Booking → Chọn phương thức → Xử lý → Kết quả
```

Trạng thái thanh toán:
- `PENDING` — Chờ thanh toán
- `PROCESSING` — Đang xử lý
- `SUCCESS` — Thành công
- `FAILED` — Thất bại
- `CANCELLED` — Đã hủy
- `EXPIRED` — Hết hạn

---

## 4. Authentication

- Đăng nhập / Đăng ký / Đăng xuất
- Đăng nhập bằng Google OAuth
- JWT access token + refresh token
- Token lưu trong `localStorage`
- Auto refresh token khi nhận 401 (xem `axiosClient.js`)

---

## 5. Quy tắc hành xử cho Agent

### ✅ Agent PHẢI làm

1. **Đọc file liên quan** trước khi sửa code (xem `FOLDER_STRUCTURE.md`).
2. **Giữ nguyên naming conventions** của domain (xem `CODE_CONVENTIONS.md`).
3. **Dùng axios layer có sẵn** — không gọi fetch() trực tiếp.
4. **Dùng design tokens** từ `index.css` — không hardcode màu.
5. **Dùng `lucide-react`** cho icons — không import icon từ nguồn khác.
6. **Dùng `react-hot-toast`** cho notifications.
7. **Xử lý loading + error state** trong mọi async operation.
8. **Kiểm tra auth guard** trước khi cho phép đặt vé.

### ❌ Agent KHÔNG được làm

1. Thêm nghiệp vụ **không có trong business context** (food, loyalty, shipping...).
2. Tạo `BookingCartStore` hay bất kỳ cart-like state nào nếu không được yêu cầu.
3. Thêm payment gateway mới ngoài VNPay và PayOS.
4. Thêm authentication provider mới ngoài Email và Google.
5. Thêm membership tier, loyalty points, quà tặng, promotion/coupon.
6. Dùng `useEffect` để fetch data mà không có cleanup hoặc dependency array.
7. Hardcode chuỗi màu hex vào JSX — phải dùng class từ `index.css`.
8. Thêm thư viện mới vào `package.json` mà không hỏi ý kiến.

---

## 6. Tech Stack

| Tool | Version | Mục đích |
|---|---|---|
| React | 19 | UI library |
| Vite | 8 | Build tool |
| TailwindCSS | 4 | Utility CSS |
| React Router DOM | 7 | Client-side routing |
| Axios | 1.x | HTTP client |
| Lucide React | latest | Icons |
| React Hot Toast | 2.x | Notifications |
| React Player | 3.x | Trailer video |
| Recharts | 3.x | Admin charts |
| QRCode.react | 4.x | QR code PayOS |

---

## 7. Route Map

### Client routes (public)
| Route | Component | Mô tả |
|---|---|---|
| `/` | `Home` | Trang chủ |
| `/movies/now-showing` | `MoviesPage` | Phim đang chiếu |
| `/movies/coming-soon` | `MoviesPage` | Phim sắp chiếu |
| `/movie/:id` | `MovieDetails` | Chi tiết phim |
| `/booking/:showtimeId` | `SeatSelection` | Chọn ghế |
| `/checkout` | `Checkout` | Booking flow steps |
| `/login` | `Login` | Đăng nhập |
| `/register` | `Register` | Đăng ký |
| `/forgot-password` | `ForgotPassword` | Quên mật khẩu |

### Client routes (CUSTOMER protected)
| Route | Component |
|---|---|
| `/profile` | `ClientProfile` |
| `/payment/vnpay-return` | `VNPayReturn` |

### Staff routes (STAFF protected)
| Route | Component |
|---|---|
| `/staff/dashboard` | `Dashboard` |
| `/staff/sell-ticket` | `SellTicketWizard` |
| `/staff/check-in` | `CheckIn` |
| `/staff/schedule` | `Schedule` |
| `/staff/transactions` | `TransactionHistory` |
| `/staff/profile` | `StaffProfile` |

### Admin routes (ADMIN protected)
| Route | Component |
|---|---|
| `/admin/stats` | `Stats` |
| `/admin/movies` | `Movies` |
| `/admin/showtimes` | `Showtimes` |
| `/admin/rooms` | `Rooms` |
| `/admin/rooms/:roomId/seats` | `SeatMaps` |
| `/admin/seat-templates` | `SeatMapTemplates` |
| `/admin/pricing` | `Pricing` |
| `/admin/personnel` | `Personnel` |
| `/admin/shifts` | `Shifts` |
| `/admin/customers` | `Customers` |
| `/admin/transactions` | `Transactions` |

---

## 8. Trước khi commit

1. Chạy `npm run lint` — zero errors.
2. Kiểm tra không có console.error trong browser.
3. Kiểm tra responsive trên mobile (375px) và desktop (1280px).
4. Đảm bảo không có hardcoded string màu trong JSX.
5. Đảm bảo mọi API call đều có loading state và error handling.
