# FOLDER_STRUCTURE.md — Cinema Booking System Frontend

Cây thư mục đầy đủ của repository với mô tả chi tiết.

---

## Root Level

```
cinema-booking-system-frontend/
├── AGENTS.md                   # AI Agent guide (đọc trước khi code)
├── CONTRIBUTING.md             # Git workflow, commit convention
├── README.md                   # Project overview
├── Cinema_Database_Schema_v3.md # DB schema tham khảo
├── .env.example                # Biến môi trường mẫu
├── .gitignore
├── eslint.config.js            # ESLint configuration
├── index.html                  # Entry HTML (Vite)
├── package.json
├── package-lock.json
├── vite.config.js              # Vite + TailwindCSS v4 config
├── agent-docs/                 # Tài liệu cho AI Agent
│   ├── API_CONVENTIONS.md
│   ├── ARCHITECTURE.md
│   ├── CODE_CONVENTIONS.md
│   ├── FOLDER_STRUCTURE.md     # (file này)
│   ├── testing.md
│   └── UI_UX_GUIDELINES.md
├── public/                     # Static assets (favicon, images không process)
├── dist/                       # Production build output (git-ignored)
└── src/                        # Source code chính
```

---

## `src/` — Source Code

```
src/
├── main.jsx              # Entry point React — render App vào #root
├── App.jsx               # Root component — routing, layout wrapping
├── index.css             # Design system: CSS variables, component classes, animations
│
├── api/                  # === TẦNG HTTP ===
│   │                     # Thin wrappers quanh axios, NO business logic
│   ├── axiosClient.js    # Authenticated axios (CUSTOMER/STAFF/ADMIN)
│   │                     #   → auto attach Bearer token
│   │                     #   → auto refresh token khi 401
│   │                     #   → auto unwrap response.data.data
│   ├── axiosPublic.js    # Public axios (không cần token)
│   │                     #   → dùng cho /phim, /suat-chieu public
│   ├── authApi.js        # Auth: login, register, logout, refresh-token
│   ├── movieApi.js       # Public: GET /phim, GET /phim/:id
│   ├── bookingApi.js     # Booking: giữ ghế, hủy giữ ghế, thanh toán
│   │                     #   getSeatMap, holdSeats, cancelHeldSeats
│   │                     #   realCheckout, simulatedCheckout
│   ├── paymentApi.js     # Payment: PayOS, VNPay create + status
│   ├── refundApi.js      # Hoàn vé / hủy đặt vé
│   ├── accountApi.js     # Profile: GET/PUT /tai-khoan/me
│   └── bookingHistoryApi.js # Lịch sử đặt vé của CUSTOMER
│
├── services/             # === TẦNG BUSINESS LOGIC ===
│   │                     # Orchestration, data transform, dùng api/ bên dưới
│   ├── clientService.js  # Client-side: movies, showtimes, seat map
│   │                     #   mapMovie(), mapShowtime() helpers
│   │                     #   dùng axiosPublic cho public endpoints
│   ├── adminService.js   # Admin: entry point cho admin operations
│   └── admin/            # Admin sub-services theo domain
│       ├── movieService.js       # CRUD phim (admin)
│       ├── showtimeService.js    # CRUD suất chiếu
│       ├── roomService.js        # CRUD phòng chiếu
│       ├── seatService.js        # Quản lý ghế trong phòng
│       ├── seatMapTemplateService.js # Template sơ đồ ghế
│       ├── pricingService.js     # Quản lý giá vé
│       ├── shiftService.js       # Quản lý ca làm việc nhân viên
│       ├── personnelService.js   # Quản lý nhân sự
│       ├── customerService.js    # Quản lý khách hàng
│       ├── transactionService.js # Xem giao dịch
│       └── statsService.js       # Dashboard statistics
│
├── hooks/                # === CUSTOM HOOKS ===
│   ├── customer/         # Hooks dành cho Client portal
│   │   ├── useMovieDetail.js     # Fetch phim + showtimes
│   │   ├── useMovieShowtimes.js  # Nhóm showtimes theo ngày
│   │   └── useSeatHoldTimer.js   # Countdown timer 10 phút giữ ghế
│   ├── useAdminForm.js           # Form state + validation cho Admin CRUD
│   └── useClientPagination.js    # Pagination state
│
├── pages/                # === PAGES ===
│   ├── Client/           # Client portal pages (role: CUSTOMER / public)
│   │   ├── Home.jsx              # Trang chủ: hero, phim đang chiếu, sắp chiếu
│   │   ├── MoviesPage.jsx        # Danh sách phim (now-showing / coming-soon)
│   │   ├── MovieDetails.jsx      # Entry: re-export refactored MovieDetails
│   │   ├── MovieDetails/         # Refactored chi tiết phim (có sub-components)
│   │   │   └── index.jsx         # MovieDetail page với inline booking steps
│   │   ├── MovieDetail.jsx       # [LEGACY] — giữ cho backward compat route
│   │   ├── SeatSelection.jsx     # Chọn ghế — dùng như component trong booking flow
│   │   ├── Checkout.jsx          # Tóm tắt + chọn phương thức thanh toán
│   │   ├── Payment.jsx           # Payment gateway redirect / QR
│   │   ├── VNPayReturn.jsx       # Callback page sau VNPay redirect
│   │   ├── TicketConfirmation.jsx # Xác nhận + vé điện tử QR
│   │   └── Profile/              # Trang cá nhân của CUSTOMER
│   │       ├── index.jsx         # Profile page (thông tin + lịch sử đặt vé)
│   │       └── Profile.jsx       # Entry re-export
│   │
│   ├── Auth/             # Authentication pages
│   │   ├── Login.jsx             # Đăng nhập (email + Google)
│   │   ├── Register.jsx          # Đăng ký
│   │   └── ForgotPassword.jsx    # Quên mật khẩu
│   │
│   ├── Admin/            # Admin portal pages (role: ADMIN)
│   │   ├── Stats.jsx             # Dashboard + charts
│   │   ├── Movies.jsx            # Quản lý phim
│   │   ├── Showtimes.jsx         # Quản lý suất chiếu
│   │   ├── Rooms.jsx             # Quản lý phòng chiếu
│   │   ├── SeatMaps.jsx          # Quản lý ghế trong phòng cụ thể
│   │   ├── SeatMapTemplates.jsx  # Template sơ đồ ghế
│   │   ├── Pricing.jsx           # Quản lý giá vé
│   │   ├── Shifts.jsx            # Quản lý ca làm việc
│   │   ├── Personnel.jsx         # Quản lý nhân sự
│   │   ├── Customers.jsx         # Quản lý khách hàng
│   │   └── Transactions.jsx      # Xem lịch sử giao dịch
│   │
│   └── Staff/            # Staff portal pages (role: STAFF)
│       ├── Dashboard.jsx         # Dashboard nhân viên
│       ├── SellTicket/           # Bán vé tại quầy (multi-step wizard)
│       │   ├── SellTicketWizard.jsx  # Orchestrator wizard
│       │   ├── Step1_MovieSelect.jsx # Bước 1: chọn phim
│       │   ├── Step2_SeatMap.jsx     # Bước 2: chọn ghế
│       │   ├── Step3_Checkout.jsx    # Bước 3: thanh toán
│       │   └── StaffSeatMap.jsx      # Sơ đồ ghế dành cho staff
│       ├── CheckInPage/          # Kiểm tra vé / check-in
│       │   ├── index.jsx
│       │   ├── CheckInResultAlert.jsx
│       │   └── TicketInfoCard.jsx
│       ├── Schedule/             # Lịch làm việc nhân viên
│       │   └── index.jsx
│       ├── TransactionHistory/   # Lịch sử giao dịch (staff view)
│       │   └── index.jsx
│       └── Profile/              # Profile nhân viên
│           └── index.jsx
│
├── components/           # === SHARED COMPONENTS ===
│   ├── Navbar.jsx                # Global navbar (Client portal)
│   ├── Footer.jsx                # Global footer (Client portal)
│   ├── Auth/
│   │   └── ProtectedRoute.jsx    # Route guard theo role
│   ├── Movie/
│   │   ├── MovieCard.jsx         # Card phim (poster + info + badge)
│   │   └── MovieGrid.jsx         # Grid responsive cho MovieCard
│   ├── Home/                     # Sections riêng của trang chủ
│   │   ├── HeroSection.jsx       # (ví dụ)
│   │   ├── NowShowingSection.jsx
│   │   └── ComingSoonSection.jsx
│   ├── StaffLayout/
│   │   └── StaffLayout.jsx       # Layout wrapper cho Staff portal
│   ├── Admin/                    # Components dùng trong Admin portal
│   │   ├── Common/               # Shared admin components
│   │   ├── Layout/               # Admin sidebar, header layout
│   │   ├── Movies/               # Movie management sub-components
│   │   ├── Showtimes/            # Showtime management sub-components
│   │   ├── Personnel/            # Personnel management sub-components
│   │   ├── Pricing/              # Pricing management sub-components
│   │   ├── Shifts/               # Shift management sub-components
│   │   └── Stats/                # Stats charts (Recharts)
│   ├── payment/                  # Payment shared components
│   │   └── (QR display, payment status, etc.)
│   └── common/                   # Truly shared across all portals
│       ├── ConfirmDialog.jsx     # Confirmation modal
│       ├── Header.jsx            # Generic section header
│       └── Footer.jsx            # Generic footer (admin/staff variant)
│
├── utils/                # === UTILITY FUNCTIONS ===
│   ├── formatHelper.js           # formatVND, formatDate, formatTime
│   ├── dateHelper.js             # Date parsing, grouping showtimes by date
│   ├── statusHelper.js           # Map trạng thái booking/payment → label/badge class
│   ├── paymentMethodHelper.js    # Map payment method → label/icon
│   ├── showtimeHelper.js         # Nhóm showtimes theo ngày, format giờ
│   ├── visualHelper.js           # getMovieVisuals() — fallback poster/backdrop
│   ├── normalize.js              # Chuẩn hóa data từ backend
│   ├── exportHelper.js           # Export CSV/Excel (admin)
│   └── toastHelper.js            # Wrapper toast với cinema context
│
├── constants/            # === CONSTANTS ===
│   ├── movies.js                 # SEAT_STATUS, MOVIE_RATING, mock movie data
│   └── adminMockData.js          # Mock data cho admin development
│
├── data/                 # === STATIC DATA ===
│   └── (static JSON, seed data nếu cần)
│
├── styles/               # === SCOPED CSS ===
│   └── staff.css                 # CSS riêng cho Staff portal (nếu cần override)
│
└── assets/               # === ASSETS ===
    ├── LogoUIT2.jpg              # Logo UIT (dùng trong Navbar)
    └── (hình ảnh, fonts local nếu cần)
```

---

## Quy tắc tổ chức

### Khi tạo page mới
1. Đặt vào đúng portal: `pages/Client/`, `pages/Admin/`, `pages/Staff/`.
2. Nếu page có nhiều sub-components riêng → tạo directory: `pages/Client/NewFeature/index.jsx`.
3. Đăng ký route trong `App.jsx`.

### Khi tạo component mới
1. Nếu dùng **nhiều nơi** → đặt vào `components/common/` hoặc `components/Movie/` (theo domain).
2. Nếu chỉ dùng trong **Admin portal** → đặt vào `components/Admin/`.
3. Nếu chỉ dùng trong **một page** → đặt ngay trong directory của page đó.

### Khi tạo API function mới
1. Đặt vào file API đúng domain trong `src/api/`.
2. Thêm JSDoc.
3. Cập nhật bảng trong `agent-docs/API_CONVENTIONS.md`.

### Khi tạo utility mới
1. Xác định xem đã có file helper phù hợp chưa.
2. Không tạo file mới nếu có thể thêm function vào file hiện có.
3. Luôn export named export (không default export cho utils).
