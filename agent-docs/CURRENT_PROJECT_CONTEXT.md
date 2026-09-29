# NexCinema — Context và quy tắc UI hiện hành

Đọc file này cùng `AGENTS.md` trước khi thực hiện thay đổi giao diện hoặc luồng đặt vé. Đây là ghi chú vận hành ngắn để agent tiếp tục công việc trong đúng ngữ cảnh hiện tại; `src/index.css`, `src/styles/admin.css`, API và schema là nguồn sự thật cho hành vi đang chạy.

## Bối cảnh sản phẩm

- NexCinema là hệ thống đặt vé cho một cụm rạp. Vai trò chính: khách hàng (`CUSTOMER`) và quản trị viên (`ADMIN`).
- Luồng khách hàng: chọn phim/suất chiếu → chọn ghế → thanh toán → nhận vé. Khách có thể đổi suất ở bước chọn ghế; khi đổi suất cần xóa lựa chọn cũ và tải sơ đồ mới.
- Giữ ghế 10 phút. Dùng API/service hiện hữu và kiểm tra trạng thái ghế từ backend; không tự tạo cart hoặc trạng thái thanh toán giả.
- Cổng đang có: VNPay Sandbox và PayOS. Không thêm gateway mới nếu chưa được yêu cầu.
- Frontend: React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, Lucide, React Hot Toast. QR PayOS dùng `qrcode.react` đã cài sẵn. Quét QR camera / file dùng `html5-qrcode`.
- Cấu trúc: màn hình trong `src/pages`, component dùng chung trong `src/components`, API trong `src/api`, adapter theo miền trong `src/services`, helper thuần trong `src/utils`, màu và style dùng chung trong `src/index.css` và `src/styles/admin.css`.

## Màu sắc: chọn theo token, không chọn ngẫu hứng

Giao diện Client và Admin hiện dùng nền sáng, bề mặt trắng, chữ xám đậm và đỏ NexCinema. Một số tài liệu UI cũ mô tả dark navy, tím glow, vàng và glass; mô tả đó đã lỗi thời với giao diện hiện tại. Khi tài liệu cũ xung đột, theo thứ tự: yêu cầu cụ thể mới nhất của người dùng → token CSS đang dùng → tài liệu cũ.

| Vai trò | Token / giá trị hiện hành | Dùng cho |
|---|---|---|
| Client canvas | `--client-bg` (`#f5f3f3`) | Nền trang |
| Client surface | `--client-surface` (`#ffffff`), `--client-surface-soft` (`#f8f8f8`) | Card, modal, vùng nhập |
| Client text | `--client-text` (`#171717`), `--client-muted` (`#666666`) | Nội dung và mô tả |
| Client border | `--client-border` (`#e5e7eb`) | Phân tách nhẹ |
| Brand | `--client-primary` (`#d71920`), hover `--client-primary-hover` (`#ae0011`) | CTA chính, trạng thái chọn/nhấn mạnh |
| Admin canvas/surface | `--admin-canvas` (`#f2f2f2`), `--admin-surface` (`#ffffff`) | Nền và panel Admin |
| Admin text/border | `--admin-text`, `--admin-text-secondary`, `--admin-text-muted`, `--admin-border` | Nội dung và phân cấp |
| Admin brand | `--admin-brand` (`#d71920`), `--admin-brand-hover` | CTA và trạng thái điều hướng hiện hành |
| Trạng thái | `--admin-success`, `--admin-warning`, `--admin-info`; lớp Tailwind semantic tương ứng ở Client | Chỉ dùng cho thành công, cảnh báo, thông tin |

Quy tắc áp dụng:

1. Ưu tiên CSS custom property hoặc component class hiện có. Không hardcode mã màu mới trong JSX. Nếu thực sự cần màu mới, xác định ý nghĩa và thêm token vào CSS dùng chung trước.
2. Đỏ chỉ dành cho nhận diện/CTA/hành động quan trọng; xanh lá cho thành công, amber cho cảnh báo, xanh dương cho thông tin. Không dùng nhiều màu nhấn cạnh tranh nhau.
3. Giữ tương phản chữ/nền rõ: nền sáng phải dùng chữ tối; chữ trắng chỉ đặt trên nền đủ tối. Không để nội dung chính màu trắng trên nền xám sáng.
4. Không thêm gradient tím, neon, glow, glassmorphism, shadow đen nặng, pulse hoặc hiệu ứng trang trí mặc định. Chỉ dùng khi người dùng yêu cầu và nó có mục đích sản phẩm cụ thể.
5. Không biến mọi thông tin thành card, badge hoặc nhãn uppercase. Dùng phân cấp chữ, khoảng cách và đường phân cách có chủ đích; chỉ bọc card khi cần tạo nhóm nội dung tương tác/thông tin thực sự.
6. Giữ font hiện hành `Be Vietnam Pro`; không nạp thêm font/thư viện nếu chưa được yêu cầu.
7. Dùng Lucide React sẵn có theo nét mảnh vừa phải, đúng ý nghĩa. Icon hỗ trợ nội dung, không thay thế nhãn quan trọng.

## Mô hình ghế đã thống nhất

- Sơ đồ demo có lưới vật lý 5 hàng × 6 cột.
- A–D có 6 ghế đơn mỗi hàng. Hàng E có ba booking-unit: `E1–E2`, `E3–E4`, `E5–E6`.
- Một ghế đôi là một bản ghi/đơn vị có thể bán, `DoRongCot=2`, `SucChua=2`; tổng là 27 đơn vị ghế và sức chứa 30 người.
- Cặp ghế là một nút bấm/đơn vị hold/đơn vị đặt vé. Không tạo hai ghế bán độc lập cho hai nửa.
- Hình ghế đôi nên vẽ hai đệm/tựa riêng có đường nối ở giữa, phần chân/tay vịn chung. Nó chiếm đúng bề rộng hai cột trong layout; tránh vẽ thành một thanh dài trơn. Nhãn/aria cần nói rõ đó là một ghế đôi và chứa hai người.
- Khi đổi seat map/template, phải giữ cấu trúc JSON cũ chưa biết (`aisles.custom` và khóa bổ sung) thay vì ghi đè hoặc bỏ âm thầm. Couple không được vượt biên, chồng nhau hoặc chiếm ô lối đi.

## Nguyên tắc chống giao diện “AI slop”

- Bắt đầu từ nội dung, trạng thái và thao tác thật của người dùng. Bỏ phần trang trí không giúp đọc, quyết định hoặc hoàn thành thao tác.
- Không tự điền dữ liệu giả để giao diện trông hoàn chỉnh: không bịa thời lượng/thể loại/mã vé/trạng thái thành công khi API chưa trả về.
- Với loading, empty, error, pending, success và failed, ghi đúng trạng thái backend; lỗi phải có cách tiếp tục/hành động phù hợp.
- Không dùng nhãn `00:00` làm giá trị thay thế khi giờ không hợp lệ. Giờ `TIME` từ backend phải qua `formatShowtimeTime` (`src/utils/showtimeHelper.js`) để tránh lệch timezone.
- Soát vé vào rạp tại Admin (`/admin/check-in`) dùng mã QR của phiếu đặt vé (`QRPayload`, định dạng chuẩn `QR_<UUID>`) theo backend API `POST /admin/admission/check-in`. Khách hàng hiển thị một QR chung cho phiếu đặt trong chi tiết đặt vé khi backend trả về `QRPayload`.
- Modal phải dễ đọc, đóng được bằng nút và Escape, không làm mất focus bất ngờ, có vùng nội dung cuộn được và hoạt động ở màn hình hẹp.
- Trước khi sửa UI đã tồn tại, đọc component, service/API, token CSS và domain flow liên quan. Không phỏng đoán từ screenshot đơn lẻ.

## Trạng thái handoff gần nhất

- Đã cập nhật mô hình ghế đôi, form/preview sơ đồ mẫu, hình dáng ghế đôi, giao diện xác nhận vé/chi tiết đặt vé và payment UI. Những file liên quan nằm trong `src/components/Admin/SeatMaps`, `src/components/Seats/SeatVisuals.jsx`, `src/pages/Admin/SeatMapTemplates.jsx`, `src/pages/Client/TicketConfirmation.jsx`, `src/pages/Client/Profile/BookingDetailModal.jsx`, `src/pages/Client/Payment.jsx`, `src/pages/Client/VNPayReturn.jsx`.
- Lỗi trang `/admin/seat-templates` do preview modal đọc `TongHang` khi template là `null` đã được sửa bằng null guard trong `SeatMapPreviewModal.jsx`. Render kiểm tra trường hợp null, lint mục tiêu và Vite production build đã qua.
- Astra audit đã phát hiện thêm tình huống JSON có kiểu dữ liệu sai làm editor crash, việc nhập lối đi bị format lại giữa lúc gõ, và focus trong modal chi tiết. Sol đã chỉnh các phần này nhưng lượt audit/build cuối sau các chỉnh sửa đó bị ngắt; agent tiếp tục nên kiểm tra lại chúng trước khi báo hoàn tất.
- Trong phiên hiện tại, người dùng yêu cầu tiết kiệm quota và không mở browser. Ưu tiên kiểm tra gọn qua lint/build/helper/render phía server; hỏi trước khi chạy nhiều lượt model hoặc bộ kiểm tra rộng không cần thiết.
- Thay đổi đang nằm trong working tree của cả FE và BE. Không reset, checkout, xóa hoặc gom/commit thay đổi không liên quan; giữ nguyên các chỉnh sửa người dùng/agent khác.
