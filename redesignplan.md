# Kế hoạch Redesign Dự án Bambi English (Redesign Plan)

Tài liệu này vạch ra lộ trình (Phases), các công việc cụ thể (Tasks), và danh sách kiểm tra (Checklists) để tiến hành tái thiết kế (redesign) và cập nhật nội dung (content) cho frontend của trung tâm Anh ngữ Bambi English.

Mục tiêu cốt lõi:
1. **Design:** Chuyển đổi giao diện sang phong cách hiện đại (Premium, Glassmorphism) với tone màu chủ đạo là **Xanh lá (Green)** và **Cam (Orange)**.
2. **Content:** Thay thế 100% dữ liệu giả (Lorem Ipsum/Mock data) bằng nội dung thật từ website `thieunhi.edu.vn`.

---

## 🟢 Phase 1: Chuẩn hóa Cấu hình Thiết Kế (Design System Setup)
*Cập nhật lại hệ thống màu sắc, typography và các component tái sử dụng (reusable components) theo `design.md` mới nhất.*

### Tasks & Checklist:
- [ ] **Cập nhật Tailwind Config:**
  - [ ] Sửa `tailwind.config.js`: Tập trung vào `bambi-green` và `bambi-orange`. Lược bỏ các màu không cần thiết.
- [ ] **Cập nhật Global CSS:**
  - [ ] Định nghĩa lại các CSS class dùng chung cho Gradient (VD: `bg-gradient-bambi`).
  - [ ] Thêm các class tiện ích cho Glassmorphism (VD: `glass-card`, `glass-panel`).
- [ ] **Chuẩn hóa Components Cốt lõi (Core UI):**
  - [ ] Sửa đổi Button styles (Thêm hiệu ứng hover, shadow màu cam/xanh).
  - [ ] Tạo Typography components (H1, H2, text content) chuẩn với `Nunito` và `Quicksand`.
  - [ ] Sửa đổi Card layout (Bo góc `rounded-2xl`, thêm micro-animations khi hover).

---

## 🟠 Phase 2: Cập nhật Cấu trúc Dữ liệu (Data & Content Modeling)
*Tạo và cập nhật các file lưu trữ dữ liệu (JSON/TS) để phản ánh đúng thực tế của trung tâm.*

### Tasks & Checklist:
- [ ] **Dữ liệu Địa điểm (Locations):**
  - [ ] Xóa cơ sở Quận 1, Quận 7.
  - [ ] Cập nhật 4 cơ sở thật: Thông Tây Hội (Q.Gò Vấp), Thạnh Mỹ Tây (Q.Bình Thạnh), An Hội Đông (Q.Gò Vấp), Hiệp Bình (TP Thủ Đức).
- [ ] **Dữ liệu Chương trình học (Programs):**
  - [ ] Xây dựng lộ trình chuẩn Cambridge: Starters, Movers, Flyers, KET, PET, IELTS.
- [ ] **Dữ liệu Bài viết / Thông tin (Info):**
  - [ ] Đưa nội dung "Giáo dục hướng cá nhân" và "5 KHÔNG" vào hệ thống content.
  - [ ] Bổ sung nội dung về học phí và lịch học linh hoạt (1h45p/ca, 1-6 buổi/tuần).

---

## 🟢 Phase 3: Redesign & Thay thế nội dung trên từng Trang (Pages Implementation)
*Áp dụng Design System (Phase 1) và Dữ liệu thực tế (Phase 2) vào từng UI Component.*

### Tasks & Checklist:
- [ ] **Trang Chủ (`home.component.ts/html`):**
  - [ ] *Hero Banner:* Đổi sang dải gradient Xanh/Cam hoặc background ảnh bo tròn + Glassmorphism. Cập nhật slogan thực tế của trung tâm.
  - [ ] *Course List:* Hiển thị lộ trình Cambridge thay vì khóa học fake.
  - [ ] *Core Values:* Bổ sung section giới thiệu phương pháp "Giáo dục hướng cá nhân".
- [ ] **Trang Địa điểm (`location.component.ts/html`):**
  - [ ] Hiển thị danh sách 4 cơ sở bằng Layout dạng Card lưới.
  - [ ] Style lại bằng màu xanh/cam chủ đạo, làm nổi bật Hotline/Zalo.
- [ ] **Trang Thông tin (`info.component.ts/html`):**
  - [ ] Cập nhật toàn bộ bài viết giới thiệu phương pháp giáo dục.
- [ ] **Trang Học Phí & Lịch Học (`schedule.component.ts/html`):**
  - [ ] Giải thích rõ mô hình đóng học phí theo buổi/tháng.
  - [ ] Thêm Call-to-Action (Đăng ký trải nghiệm miễn phí & Test năng lực).
- [ ] **Trang Cơ Sở Vật Chất (`facilities.component.ts/html`):**
  - [ ] Setup UI lưới hình ảnh (Image Grid / Carousel).

---

## 🟠 Phase 4: Đánh giá & Tinh chỉnh (Review & Polish)
*Kiểm tra độ hoàn thiện, trải nghiệm người dùng (UX) và khả năng tương thích.*

### Tasks & Checklist:
- [ ] **Responsive Design:**
  - [ ] Đảm bảo Hero Banner và các Text lớn hiển thị đẹp trên điện thoại di động (Mobile-first).
  - [ ] Kiểm tra Carousel / lưới Card trên thiết bị nhỏ.
- [ ] **UX & Micro-animations:**
  - [ ] Kiểm tra tất cả các nút bấm xem đã có Hover/Active state chưa.
  - [ ] Mượt mà hóa các thao tác chuyển trang (Routing transitions).
- [ ] **Kiểm tra độ tương phản (Accessibility):**
  - [ ] Đảm bảo Text (Trắng) đọc rõ trên nền Xanh/Cam.
- [ ] **User Acceptance:** Xác nhận với Product Owner/Stakeholder về thiết kế mới và độ chính xác của nội dung.
