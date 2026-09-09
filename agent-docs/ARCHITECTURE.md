# ARCHITECTURE.md — Cinema Booking System Frontend

Mô tả kiến trúc tổng thể của ứng dụng frontend.

---

## 1. Tech Stack

| Layer            | Technology                                          |
| ---------------- | --------------------------------------------------- |
| UI Framework     | React 19 (JSX)                                      |
| Build Tool       | Vite 8                                              |
| Routing          | React Router DOM 7                                  |
| Styling          | TailwindCSS v4 + Vanilla CSS (`index.css`)          |
| HTTP Client      | Axios 1.x                                           |
| Icons            | Lucide React                                        |
| Notifications    | React Hot Toast                                     |
| Video            | React Player                                        |
| Charts (Admin)   | Recharts 3                                          |
| QR Code          | QRCode.react                                        |
| State Management | React built-in (`useState`, `useContext`, `useRef`) |

---

## 2. Kiến trúc Tổng thể

```
┌─────────────────────────────────────────────────────┐
│                         UI                           │
│   (TailwindCSS + index.css design tokens)            │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│              Pages / Components                      │
│  Client pages │ Admin pages │ Staff pages            │
│  Shared components (Navbar, Footer, Modal...)        │
└──────┬──────────────────────────┬───────────────────┘
       │                          │
┌──────▼───────┐        ┌─────────▼──────────┐
│   Hooks       │        │   Context / State   │
│ (custom hooks)│        │  (React built-in)   │
└──────┬───────┘        └────────────────────┘
       │
┌──────▼───────────────────────────────────────────────┐
│                  Service Layer                        │
│  clientService.js  │  adminService.js                 │
│  admin/*.js        │                                  │
└──────┬───────────────────────────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────┐
│                  API Layer                            │
│  bookingApi.js │ paymentApi.js │ movieApi.js           │
│  authApi.js    │ accountApi.js │ refundApi.js          │
└──────┬───────────────────────────────────────────────┘
       │
┌──────▼───────────────────────────────────────────────┐
│              HTTP Clients                             │
│  axiosClient (authenticated)  │  axiosPublic (public) │
└──────┬───────────────────────────────────────────────┘
       │
       ▼
   Backend API (http://localhost:5000/api/v1)
```

---

## 3. User Roles & Portal Separation

Hệ thống có **3 portal** hoàn toàn tách biệt về layout và routes:

### 🎬 Client Portal (`/`)

- Navbar + Footer bao ngoài (xem `App.jsx`)
- Dành cho: `CUSTOMER` (chưa đăng nhập xem được phần lớn, cần đăng nhập để đặt vé)
- Route prefix: `/`, `/movie/...`, `/booking/...`, `/profile`, `/payment/...`

### 🎟 Staff Portal (`/staff`)

- `StaffLayout` — sidebar riêng, không có Navbar chung
- Dành cho: `STAFF` (nhân viên rạp)
- Chức năng: Bán vé tại quầy, check-in khách, xem lịch làm việc

### ⚙️ Admin Portal (`/admin`)

- Layout admin riêng — sidebar, không có Navbar chung
- Dành cho: `ADMIN`
- Chức năng: CRUD toàn bộ dữ liệu hệ thống

---

## 4. Booking Flow Architecture

Booking không phải là một page đơn — đây là **multi-step wizard** trải qua nhiều component.

### Booking State

State booking được truyền qua `props` và `useNavigate state`:

```
MovieDetails.jsx
  → chứa state: selectedDate, availableSlots, selectedSlotIndex
  → render SeatSelection (inline, cùng trang)
  → SeatSelection: selectedSeats, holdSeats API call
  → onConfirmBooking() → navigate('/checkout', { state: bookingPayload })

Checkout.jsx
  → nhận bookingPayload từ location.state
  → render Checkout flow (chọn phương thức thanh toán, tóm tắt)
  → gọi realCheckout API
  → VNPay: redirect | PayOS: show QR

VNPayReturn.jsx
  → nhận query params từ VNPay redirect
  → fetch payment status
  → hiển thị kết quả

TicketConfirmation.jsx
  → hiển thị vé điện tử (QR code + thông tin đặt vé)
```

### Seat Hold Timer

- Backend giữ ghế trong **10 phút** sau khi gọi `/dat-ve/giu-ghe`.
- Frontend hiển thị countdown timer (`useSeatHoldTimer.js`).
- Khi hết giờ → ghế tự động release → frontend phải refetch sơ đồ ghế.

---

## 5. Component Architecture

### Phân loại component

```
src/components/
├── Navbar.jsx            — Global navigation (Client portal)
├── Footer.jsx            — Global footer (Client portal)
├── Auth/
│   └── ProtectedRoute.jsx — Route guard theo role
├── Movie/
│   ├── MovieCard.jsx     — Card hiển thị phim trong grid
│   └── MovieGrid.jsx     — Grid layout cho MovieCard
├── Home/                 — Sections của trang chủ
├── Admin/                — Components dùng trong Admin portal
│   ├── Common/           — Shared admin components
│   ├── Layout/           — Admin sidebar, header
│   ├── Movies/           — Movie management UI
│   ├── Showtimes/        — Showtime management UI
│   ├── Personnel/        — Staff management UI
│   ├── Pricing/          — Pricing management UI
│   ├── Shifts/           — Shift management UI
│   └── Stats/            — Dashboard charts
├── StaffLayout/          — Staff portal layout
├── payment/              — Payment-related shared components
└── common/               — Truly shared: ConfirmDialog, Header, Footer
```

### Quy tắc tạo component

1. **Một file = một component** chính (có thể export sub-components nhỏ từ cùng file).
2. Component phải **stateless** càng nhiều càng tốt — state nên ở page level.
3. Prop drilling tối đa **3 levels** — nếu sâu hơn, dùng Context hoặc lift state.
4. Tên component: `PascalCase`, tên file: giống tên component.

---

## 6. Custom Hooks

Đặt trong `src/hooks/`:

| Hook                            | Mô tả                                  |
| ------------------------------- | -------------------------------------- |
| `customer/useMovieDetail.js`    | Fetch chi tiết phim + suất chiếu       |
| `customer/useMovieShowtimes.js` | Fetch và nhóm suất chiếu theo ngày     |
| `customer/useSeatHoldTimer.js`  | Countdown timer 10 phút giữ ghế        |
| `useAdminForm.js`               | Form state + validation cho admin CRUD |
| `useClientPagination.js`        | Pagination state cho client pages      |

### Pattern chuẩn cho custom hook

```js
// src/hooks/customer/useMovieDetail.js
import { useState, useEffect } from "react";
import clientService from "../../services/clientService";

/**
 * Hook lấy chi tiết phim và danh sách suất chiếu theo ngày.
 * @param {string} movieId - MaPhim
 */
export const useMovieDetail = (movieId) => {
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!movieId) return;
    let cancelled = false;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await clientService.getMovieById(movieId);
        if (!cancelled) setMovie(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    }; // cleanup
  }, [movieId]);

  return { movie, showtimes, isLoading, error };
};
```

---

## 7. Routing & Auth Guards

```jsx
// App.jsx pattern

// Public — ai cũng xem được
<Route path="/movie/:id" element={<MovieDetails />} />

// Protected — chỉ CUSTOMER
<Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
  <Route path="/profile" element={<ClientProfile />} />
</Route>

// Protected — chỉ STAFF
<Route element={<ProtectedRoute allowedRoles={['STAFF']} />}>
  <Route path="/staff" element={<StaffLayout />}>
    <Route path="sell-ticket" element={<SellTicketWizard />} />
  </Route>
</Route>
```

`ProtectedRoute` kiểm tra:

1. `accessToken` trong localStorage.
2. `userRole` phải match `allowedRoles`.
3. Nếu không pass → redirect `/login`.

---

## 8. State Management Philosophy

Dự án **không** dùng global state library. Thay vào đó:

| Loại state                | Cách quản lý                          |
| ------------------------- | ------------------------------------- |
| UI state (modal, loading) | `useState` trong component            |
| Server data               | Fetch trong `useEffect` + local state |
| Form state                | `useState` hoặc `useAdminForm` hook   |
| Cross-route data          | `location.state` (React Router)       |
| Auth info                 | `localStorage` (đọc trực tiếp)        |

> Booking state được truyền qua `location.state` khi navigate từ SeatSelection → Checkout.

---

## 9. Deployment Consideration

- `npm run dev` — Vite dev server, HMR
- `npm run build` — Build production bundle
- `npm run preview` — Preview production build locally
- Env file: `.env` (copy từ `.env.example`)
