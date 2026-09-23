# CONTRIBUTING.md — Cinema Booking System Frontend

Hướng dẫn đóng góp code cho dự án `cinema-booking-system-frontend`.

---

## 1. Yêu cầu môi trường

```bash
Node.js  >= 20.x
npm      >= 10.x
```

```bash
# Cài dependencies
npm install

# Chạy dev server
npm run dev        # http://localhost:5173

# Lint
npm run lint

# Build production
npm run build
```

---

## 2. Git Workflow

Dự án sử dụng **GitHub Flow** (trunk-based với feature branches).

### Nhánh chính

| Branch | Mục đích |
|---|---|
| `main` | Production — chỉ merge qua PR |
| `develop` | Staging / integration |
| `feature/*` | Feature mới |
| `fix/*` | Bug fix |
| `hotfix/*` | Fix khẩn cấp trực tiếp lên main |
| `chore/*` | Cấu hình, refactor, docs |

### Workflow cơ bản

```bash
# 1. Tạo branch từ develop
git checkout develop
git pull origin develop
git checkout -b feature/seat-selection-redesign

# 2. Commit thường xuyên, message rõ ràng
git commit -m "feat(seat): add couple seat icon component"

# 3. Push và tạo PR vào develop
git push origin feature/seat-selection-redesign

# 4. PR được review và merge vào develop
# 5. Deploy staging → test
# 6. Merge develop → main khi release
```

---

## 3. Commit Message Convention

Format: `<type>(<scope>): <subject>`

### Types

| Type | Dùng khi |
|---|---|
| `feat` | Thêm tính năng mới |
| `fix` | Sửa bug |
| `style` | CSS/UI thay đổi không ảnh hưởng logic |
| `refactor` | Cải thiện code không thêm feature/fix bug |
| `perf` | Tối ưu hiệu năng |
| `test` | Thêm/sửa test |
| `docs` | Cập nhật documentation |
| `chore` | Build, config, dependencies |
| `ci` | CI/CD pipeline |

### Scopes (Cinema Booking Domain)

| Scope | Phạm vi |
|---|---|
| `movie` | Movie listing, detail, trailer |
| `booking` | Booking flow, seat selection |
| `payment` | Payment flow, VNPay, PayOS |
| `auth` | Login, register, OAuth |
| `profile` | User profile, booking history |
| `showtime` | Showtime display, selection |
| `seat` | Seat map, seat types |
| `admin` | Admin panel |
| `staff` | Staff portal |
| `api` | API layer changes |
| `ui` | Shared components, design system |
| `nav` | Navbar, footer, layout |

### Ví dụ

```
feat(booking): implement seat hold timer with auto-cancel
fix(payment): handle VNPay callback edge case when user closes browser
style(movie): update MovieCard to use new badge design tokens
refactor(seat): extract SeatGrid into reusable component
docs(api): document bookingApi endpoints
chore(deps): update lucide-react to latest
```

---

## 4. Pull Request Guidelines

### PR Title
Giống commit message: `feat(booking): add couple seat icon`

### PR Description template

```markdown
## Mô tả
<!-- Mô tả ngắn gọn thay đổi -->

## Loại thay đổi
- [ ] Bug fix
- [ ] Feature mới
- [ ] Refactor
- [ ] Style/UI
- [ ] Docs

## Màn hình liên quan
<!-- Điền route bị ảnh hưởng, ví dụ: /booking/:showtimeId -->

## Checklist
- [ ] Code đã được lint (npm run lint)
- [ ] Không có console.error/warn
- [ ] Responsive trên mobile (375px) và desktop (1280px+)
- [ ] Loading + error state đã xử lý
- [ ] Không hardcode màu hex trong JSX
- [ ] Không thêm nghiệp vụ ngoài phạm vi cinema booking
```

### Review rules
- Tối thiểu **1 approval** trước khi merge.
- Không tự merge PR của mình.
- Squash merge vào `develop`, fast-forward merge vào `main`.

---

## 5. Code Style

Xem chi tiết trong [`agent-docs/CODE_CONVENTIONS.md`](agent-docs/CODE_CONVENTIONS.md).

Tóm tắt nhanh:
- ESLint config sẵn có — không tắt rules tùy tiện.
- Không dùng `var` — chỉ dùng `const` / `let`.
- Arrow functions cho component và handler.
- JSDoc cho hàm utility và API function.
- Tailwind classes — không viết inline style CSS nếu không cần thiết.
- Dùng CSS custom properties từ `index.css` thay vì hardcode màu.

---

## 6. Không được làm trong codebase này

- Thêm nghiệp vụ ngoài phạm vi: food, loyalty, multi-cinema, merchandise.
- Thêm thư viện nặng mà không thảo luận (Redux, MobX, React Query...).
- Gọi API bằng `fetch()` — phải dùng `axiosClient` hoặc `axiosPublic`.
- Commit trực tiếp lên `main` hoặc `develop`.
