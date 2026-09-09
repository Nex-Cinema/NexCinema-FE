# UI_UX_GUIDELINES.md — Cinema Booking System Frontend

Hướng dẫn thiết kế UI/UX cho toàn bộ Cinema Booking System.

---

## 1. Design Philosophy

> **Cinematic Luxury** — Trải nghiệm người dùng phải gợi lên cảm giác sang trọng, premium và đặc biệt của việc đi xem phim tại rạp.

Ba nguyên tắc cốt lõi:
1. **Immersive** — Nền tối, ánh sáng glow, poster phim chiếm diện tích lớn.
2. **Frictionless** — Booking flow rõ ràng, tối thiểu bước, không có yếu tố làm người dùng phân tâm.
3. **Trustworthy** — Thông tin rõ ràng, trạng thái minh bạch, xử lý lỗi thân thiện.

---

## 2. Color System

Xem đầy đủ CSS custom properties trong `src/index.css`.

### Bảng màu chính

| Token | Giá trị | Ngữ nghĩa |
|---|---|---|
| `--color-bg` | `#0B1020` | Nền canvas chính — deep cinematic dark |
| `--color-bg-panel` | `#131A2A` | Panel, sidebar, glass card |
| `--color-bg-elevated` | `#1B2435` | Raised element (card nổi, dropdown) |
| `--color-gold` | `#FFB000` | Accent chính — CTA phụ, highlight, giá vé, rating |
| `--color-red` | `#ff436e` | Accent cinema — CTA đặt vé, ghế đang chọn, urgency |
| `--color-purple` | `#7C3AED` | Ambient glow, VIP seat |
| `--color-pink` | `#ec4899` | Couple seat |

### Sử dụng màu đúng ngữ cảnh

| Ngữ cảnh | Màu | Class |
|---|---|---|
| CTA chính (Đặt vé, Mua vé) | Cinema Red | `.btn-primary` |
| CTA phụ (Xem trailer, Tìm hiểu thêm) | Gold | `.btn-bright` |
| Hành động thứ cấp | Glass | `.btn-ghost` |
| Hành động nguy hiểm (Hủy vé) | Rose | `.btn-danger` |
| Ghế đang chọn | `--color-red` | inline animation |
| Ghế VIP | `--color-purple` | seat-vip styling |
| Ghế Đôi | `--color-pink` | seat-couple styling |
| Giá vé | `--color-gold` | `.gradient-text-gold` hoặc `text-[#FFB000]` |
| Rating | `--color-gold` | `.rating-badge` |

---

## 3. Typography

Xem chi tiết trong `src/index.css`, phần Typography Scale.

### Font families
- **Display / Heading:** `Montserrat` — weight 700–900
- **Body / UI:** `Inter` — weight 400–600

### Sử dụng đúng scale

| Dùng cho | Class / Variable | Ví dụ |
|---|---|---|
| Slogan trang chủ | `text-display` | "Khám phá điện ảnh đỉnh cao" |
| Tiêu đề section | `text-h2`, `font-display` | "Phim đang chiếu hôm nay" |
| Tên phim trong card | `text-h3`, `font-bold` | "Avengers: Secret Wars" |
| Giá vé | `text-2xl font-black text-[--color-gold]` | "360.000 ₫" |
| Thể loại, metadata | `text-xs tracking-wider uppercase` | "HÀNH ĐỘNG • 148 phút" |
| Badge / Label | `text-[11px] font-black uppercase tracking-wider` | "IMAX 3D" |
| Body text | `text-sm text-[--color-text-muted]` | Nội dung phim |

---

## 4. Spacing & Layout

### Padding chuẩn
- Page wrapper: `px-4 md:px-8 lg:px-16 xl:px-24`
- Card nội bộ: `p-5` hoặc `p-6`
- Panel: `p-6` hoặc `p-8`
- Badge, tag: `px-2.5 py-0.5`
- Button: `px-7 py-3` (standard), `px-10 py-3.5` (large)

### Gap chuẩn trong grid/flex
- Giữa elements nhỏ: `gap-2`, `gap-3`
- Giữa cards: `gap-5`, `gap-6`
- Giữa sections: `gap-12`, `gap-16`

### Grid layout phim
```jsx
// Movie grid — responsive
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
```

---

## 5. Component Design Patterns

### Movie Card

```
┌─────────────┐
│  Poster     │ ← aspect-ratio: 2/3
│  Image      │
│             │
│  ┌─ Badge ─┐│ ← VIP / IMAX / 18+ — badge-red / badge-gold / badge-muted
│  └─────────┘│
├─────────────┤
│ Tên phim    │ ← font-bold, line-clamp-2
│ Thể loại    │ ← text-muted, text-xs
│ ⭐ Rating   │ ← rating-badge
│ [Mua vé]   │ ← btn-primary, xuất hiện khi hover
└─────────────┘
```

**Rules:**
- Card hover → nâng lên (`-translate-y-1.5`), viền gold nhạt.
- Poster lỗi → fallback image từ `visualHelper.getMovieVisuals()`.
- Nút "Mua vé" chỉ xuất hiện khi hover (opacity transition).

---

### Showtime Slot

```
┌──────────────────┐
│ 🕐 08:30         │ ← font-bold
│ Phòng IMAX 1     │ ← text-muted, text-xs
└──────────────────┘
```

State:
- Default: `.showtime-slot`
- Selected: `.showtime-slot.active` (Cinema Red gradient, glow)
- Full/Unavailable: disabled, opacity-40

---

### Booking Progress

```
① ──────── ② ──────── ③ ──────── ④
Suất chiếu  Chọn ghế  Thanh toán  Xác nhận
```

```jsx
<div className="booking-progress">
  <div className="booking-step completed">1</div>
  <div className="booking-step-line completed" />
  <div className="booking-step active">2</div>
  <div className="booking-step-line" />
  <div className="booking-step">3</div>
  <div className="booking-step-line" />
  <div className="booking-step">4</div>
</div>
```

**Không thêm bước:** Chọn rạp, chọn đồ ăn, chọn thức uống.

---

### Seat Map

#### Màu ghế theo loại và trạng thái

| Trạng thái | Icon color | Stroke | Mô tả |
|---|---|---|---|
| Trống - Thường | `#232B3A` | slate-700 | Ghế thường trống |
| Trống - VIP | `#18112C` | purple-500 | Ghế VIP trống |
| Trống - Đôi | `#281123` | pink-500 | Ghế Đôi trống |
| Đang chọn | `#ff436e` + glow | `#ff436e` | Ghế người dùng đang chọn |
| Đã đặt | `#0E131F`, opacity 30% | slate-900 | Không thể click |
| Đang giữ | `#2A160F`, opacity 40% | orange-900 | Đang giữ bởi người khác |

#### Screen indicator
- Hiển thị frame màn hình cong ở phía trên sơ đồ ghế.
- Viền Cinema Red (`#ff436e`), gradient subtle từ trên xuống.
- Text "MÀN HÌNH" — `text-3xs text-slate-500 tracking-[0.3em] font-black`.

#### Aisle (lối đi)
- Aisle column → cell rỗng (`w-9 h-9 shrink-0`).
- Không render button, không có label.

---

### Payment Method Card

```
┌──────────────────────────────────┐
│  [Logo]  VNPay                   │  ← font-bold
│          Thanh toán qua VNPay    │  ← text-muted, text-sm
└──────────────────────────────────┘
```

State:
- Default: `.payment-method-card`
- Selected: `.payment-method-card.selected` — viền gold, background gold-dim

---

### Ticket / Confirmation Card

```
┌─────────────────────────────────┐
│  [QR Code]                      │
│  Avengers: Secret Wars          │
│  IMAX 3D • Phòng 1              │
├─ - - - - - - - - - - - - - - - ─┤  ← ticket-perforation
│  Giờ chiếu:   08:30             │
│  Ghế:         B5, B6, B7        │
│  Tổng tiền:   360.000 ₫         │
└─────────────────────────────────┘
```

- `.ticket-card` — gradient background, rounded-3xl
- `.ticket-perforation` — dashed separator với circle cutouts

---

## 6. Animation Guidelines

### Micro-animations được phép

| Tương tác | Animation |
|---|---|
| Page load | `.animate-in.fade-in.duration-500` |
| Modal mở | `.animate-in.zoom-in.duration-300` |
| Dropdown xuất hiện | `.animate-in.slide-in-from-top-4.duration-300` |
| Panel slide in | `.animate-in.slide-in-from-bottom-4.duration-300` |
| Button hover | `transition-all duration-300`, shadow tăng |
| Card hover | `-translate-y-1.5 transition-all duration-500` |
| Seat select | `scale(1.25)` pop animation (100ms) |
| Toast | Managed by `react-hot-toast` |

### Animation không được dùng
- Animation vòng lặp vô tận (trừ `spinner` và `ticker-scroll`).
- Animation > 700ms (trừ page-level fade-in).
- Bounce/elastic easing trên elements quan trọng.

---

## 7. Responsive Design

### Breakpoints
```
Mobile:  < 640px  — Single column, stacked layout
Tablet:  640-1023px — 2 columns
Desktop: 1024px+  — Full layout với sidebar
Large:   1280px+  — Optimal layout
```

### Mobile-specific rules
- Navbar menu collapse thành hamburger.
- Seat map có thể scroll ngang (`overflow-x: auto`).
- Movie grid: 2 cột trên mobile.
- Booking sidebar (showtime selector) stacks lên top trên mobile.
- Nút "Đặt vé" / "Tiếp tục" phải luôn visible (không bị modal/panel che).

---

## 8. Accessibility

- Tất cả button có `title` attribute mô tả action.
- Image có `alt` text.
- Disabled state rõ ràng (`opacity-40`, `cursor-not-allowed`).
- Focus ring hiển thị khi dùng keyboard (`focus:ring-2`).
- Contrast ratio body text trên dark background ≥ 4.5:1.

---

## 9. Loading & Empty States

### Loading
```jsx
// Spinner trong container
<div className="flex justify-center py-20">
  <div className="spinner w-10 h-10" />
  <span className="text-glow-red text-xs uppercase tracking-widest ml-3">
    Đang tải...
  </span>
</div>

// Skeleton cho movie grid
<div className="skeleton aspect-poster rounded-2xl" />
```

### Empty state
```jsx
<div className="empty-state">
  <FilmIcon className="empty-state-icon" />
  <p className="empty-state-title">Không có phim nào</p>
  <p className="empty-state-desc">Thử thay đổi bộ lọc hoặc quay lại sau.</p>
</div>
```

### Error state
```jsx
<div className="empty-state">
  <AlertCircle className="empty-state-icon text-rose-500" />
  <p className="empty-state-title">Không thể tải dữ liệu</p>
  <button className="btn-ghost mt-2" onClick={retry}>Thử lại</button>
</div>
```

---

## 10. Nghiêm cấm trong UI

- ❌ Dùng màu trắng thuần (`#ffffff`) cho background — luôn dùng dark theme.
- ❌ Thêm bước "Chọn rạp" trong booking flow.
- ❌ Hiển thị food/beverage upsell.
- ❌ Hiển thị loyalty points, membership tier, star points.
- ❌ Dùng card style sáng (white background) trong Client portal.
- ❌ Dùng serif font cho bất kỳ element nào.
- ❌ Animation shake/jiggle trên các element quan trọng.
- ❌ Alert box trình duyệt native (`alert()`, `confirm()`).
