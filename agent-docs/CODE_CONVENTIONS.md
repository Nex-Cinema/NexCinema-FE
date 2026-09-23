# CODE_CONVENTIONS.md — Cinema Booking System Frontend

Quy ước viết code cho toàn bộ dự án.  
Agent và contributor phải tuân thủ các quy tắc này.

---

## 1. Naming Conventions

### Files & Directories
| Loại | Convention | Ví dụ |
|---|---|---|
| React component | `PascalCase.jsx` | `MovieCard.jsx`, `SeatSelection.jsx` |
| Custom hook | `camelCase.js` — prefix `use` | `useMovieDetail.js`, `useSeatHoldTimer.js` |
| Utility / helper | `camelCase.js` — suffix mô tả | `formatHelper.js`, `statusHelper.js` |
| API module | `camelCase.js` — suffix `Api` | `bookingApi.js`, `paymentApi.js` |
| Service module | `camelCase.js` — suffix `Service` | `clientService.js`, `adminService.js` |
| CSS module | `camelCase.css` hoặc `kebab-case.css` | `staff.css` |
| Directory | `PascalCase` (component dir) hoặc `camelCase` (logic) | `MovieDetails/`, `hooks/` |

### Variables & Functions
```js
// Variables: camelCase
const movieId = params.id;
const selectedSeats = [];
const isLoading = false;

// Functions: camelCase, verb prefix
const fetchMovies = async () => {};
const handleSeatClick = (seat) => {};
const formatVND = (amount) => {};

// Boolean: is/has/can/should prefix
const isLoggedIn = !!token;
const hasSelectedSeats = selectedSeats.length > 0;
const canProceedToPayment = hasSelectedSeats && !isHolding;
```

### Constants
```js
// Uppercase snake_case cho literal constants
const MAX_SEATS_PER_BOOKING = 8;
const SEAT_HOLD_DURATION_MS = 10 * 60 * 1000;

// Object constants
const SEAT_STATUS = {
  EMPTY:  'TRONG',
  BOOKED: 'DA_DAT',
  HELD:   'DANG_GIU',
};

const PAYMENT_METHOD = {
  VNPAY: 'VNPAY',
  PAYOS: 'PAYOS',
  CASH:  'TIEN_MAT',
};

const PAYMENT_STATUS = {
  PENDING:    'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS:    'SUCCESS',
  FAILED:     'FAILED',
  CANCELLED:  'CANCELLED',
  EXPIRED:    'EXPIRED',
};

const USER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  STAFF:    'STAFF',
  ADMIN:    'ADMIN',
};
```

### Cinema Domain Terminology

Luôn dùng các tên này, không được viết tắt tùy tiện:

| Term (EN) | Term (VI) | Dùng trong code |
|---|---|---|
| Movie | Phim | `movie`, `MovieCard`, `movieId` |
| Showtime | Suất chiếu | `showtime`, `showtimeId`, `MaSuatChieu` |
| Seat | Ghế | `seat`, `selectedSeats`, `seatMap` |
| Booking | Đặt vé | `booking`, `bookingPayload` |
| Payment | Thanh toán | `payment`, `paymentMethod` |
| Transaction | Giao dịch | `transaction` |
| Cinema Room / Theater | Phòng chiếu | `room`, `MaPhong` |
| Seat Map | Sơ đồ ghế | `seatMap`, `seatMapData` |
| Hold (seats) | Giữ ghế | `holdSeats`, `isHolding` |

---

## 2. Component Structure

### Chuẩn component structure

```jsx
// src/components/Movie/MovieCard.jsx

// 1. Imports — nhóm theo loại
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

// Domain utils
import { formatVND } from '../../utils/formatHelper';
import { getMovieVisuals } from '../../utils/visualHelper';

/**
 * MovieCard — hiển thị thông tin tóm tắt của một bộ phim.
 *
 * @param {object}  movie           - Dữ liệu phim (đã qua mapMovie transform)
 * @param {string}  movie.MaPhim    - ID phim
 * @param {string}  movie.TenPhim   - Tên phim
 * @param {string}  movie.HinhAnh   - URL poster
 * @param {string}  movie.TheLoai   - Thể loại (chuỗi, phân tách bởi dấu phẩy)
 * @param {number}  movie.ThoiLuong - Thời lượng (phút)
 * @param {boolean} movie.isComingSoon - Phim sắp chiếu?
 */
const MovieCard = ({ movie }) => {
  // 2. Hooks
  const [isHovered, setIsHovered] = useState(false);

  // 3. Derived state / computed values
  const visuals = getMovieVisuals(movie);
  const genreList = movie.TheLoai?.split(',').slice(0, 2) ?? [];

  // 4. Handlers
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = visuals.thumbnail;
  };

  // 5. Render
  return (
    <Link to={`/movie/${movie.MaPhim}`}>
      <div
        className="movie-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={movie.HinhAnh || visuals.thumbnail}
          alt={movie.TenPhim}
          onError={handleImageError}
          className="w-full aspect-poster object-cover"
        />
        {/* ... */}
      </div>
    </Link>
  );
};

export default MovieCard;
```

---

## 3. Hooks Rules

```js
// ✅ ĐÚNG — Cleanup trong useEffect
useEffect(() => {
  let cancelled = false;

  const fetchSeats = async () => {
    try {
      const data = await getSeatMap(showtimeId);
      if (!cancelled) setSeatMapData(data);
    } catch (err) {
      if (!cancelled) toast.error('Không thể tải sơ đồ ghế.');
    }
  };

  fetchSeats();
  return () => { cancelled = true; };
}, [showtimeId]); // dependency array đầy đủ

// ❌ SAI — Không có cleanup, dependency array trống vô lý
useEffect(() => {
  fetchSeats(); // sẽ gây race condition
}, []); // thiếu dependency

// ❌ SAI — Không có dependency array → chạy mỗi render
useEffect(() => {
  fetchSeats();
});
```

---

## 4. Import Order

```js
// 1. React core
import { useState, useEffect, useRef, useCallback } from 'react';

// 2. Third-party libraries
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Clock, Star, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

// 3. Internal API / Service
import { holdSeats, getSeatMap } from '../../api/bookingApi';
import clientService from '../../services/clientService';

// 4. Internal hooks
import { useMovieDetail } from '../../hooks/customer/useMovieDetail';

// 5. Internal components
import MovieCard from '../Movie/MovieCard';
import { ConfirmDialog } from '../common/ConfirmDialog';

// 6. Internal utils / constants / data
import { formatVND } from '../../utils/formatHelper';
import { SEAT_STATUS } from '../../constants/movies';

// 7. Assets / styles
import UITLogo from '../../assets/LogoUIT2.jpg';
```

---

## 5. CSS & Styling Rules

### Hierarchy ưu tiên (từ cao đến thấp)
1. **CSS custom properties** từ `index.css` — `var(--color-red)`, `var(--shadow-card)`
2. **Component classes** từ `index.css` — `.btn-primary`, `.movie-card`, `.badge-gold`
3. **Tailwind utility classes** — `flex`, `gap-4`, `rounded-xl`
4. **Inline style** — Chỉ dùng khi giá trị là dynamic runtime value

```jsx
// ✅ ĐÚNG — Dùng component class
<button className="btn-primary">Đặt vé</button>

// ✅ ĐÚNG — Dùng Tailwind cho layout
<div className="flex items-center gap-4 p-6">

// ✅ ĐÚNG — Inline style CHỈ khi value dynamic
<div style={{ width: `${progress}%` }} className="h-1 bg-[#ff436e]" />

// ❌ SAI — Hardcode màu hex trong className khi đã có class
<button className="bg-[#ff436e] hover:bg-[#e0325a] text-white px-7 py-3 rounded-full ...">
  Đặt vé
</button>

// ❌ SAI — Style object với màu hardcode
<div style={{ backgroundColor: '#131A2A', border: '1px solid rgba(255,255,255,0.08)' }} />
```

### Responsive breakpoints (Tailwind v4)
```
sm:  640px  — Tablet nhỏ
md:  768px  — Tablet
lg:  1024px — Desktop nhỏ
xl:  1280px — Desktop
2xl: 1536px — Desktop lớn
```

---

## 6. JSDoc Convention

Tất cả API functions và utility functions phải có JSDoc:

```js
/**
 * Định dạng số tiền theo chuẩn tiền Việt Nam.
 *
 * @param {number} amount - Số tiền (VND)
 * @returns {string} Chuỗi đã định dạng, ví dụ: "120.000 ₫"
 *
 * @example
 * formatVND(120000) // "120.000 ₫"
 */
export const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
```

---

## 7. Error & Loading Pattern

Mọi async operation trong page/component **phải** xử lý:

```jsx
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);

// Loading state
if (isLoading) return (
  <div className="flex justify-center py-20">
    <div className="spinner w-10 h-10" />
  </div>
);

// Error state
if (error) return (
  <div className="empty-state">
    <p className="empty-state-title">Không thể tải dữ liệu</p>
    <p className="empty-state-desc">{error}</p>
    <button className="btn-ghost" onClick={refetch}>Thử lại</button>
  </div>
);

// Empty state
if (!data || data.length === 0) return (
  <div className="empty-state">
    <p className="empty-state-title">Chưa có dữ liệu</p>
  </div>
);
```

---

## 8. Không được làm

- ❌ `var` — dùng `const` / `let`.
- ❌ `any` type (nếu dùng TypeScript sau này).
- ❌ Hardcode string màu hex trong JSX khi đã có CSS class.
- ❌ Magic numbers — đặt tên constant.
- ❌ Tắt ESLint rule bằng `// eslint-disable-line` mà không comment lý do.
- ❌ Trả về JSX từ hook.
- ❌ Fetch data trong component mà không có cleanup (`cancelled` flag hoặc `AbortController`).
- ❌ Thêm nghiệp vụ ngoài phạm vi cinema booking vào codebase.
