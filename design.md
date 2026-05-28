# Hướng Dẫn Thiết Kế & Nhận Diện Thương Hiệu (Design Guidelines) - Bambi English

Tài liệu này định nghĩa hệ thống thiết kế (Design System), bao gồm bảng màu cốt lõi và các hướng dẫn để thiết kế lại (redesign) dự án nhưng vẫn giữ được tinh thần và bản sắc riêng của Bambi English.

## 1. Bảng Màu Chính (Core Palette)

Dựa trên yêu cầu tối giản và tập trung, hệ thống thiết kế sẽ xoay quanh 2 tone màu chủ đạo: Xanh lá (Green) và Cam (Orange), tiết chế tối đa các màu sắc phụ trợ khác để tạo sự đồng nhất và chuyên nghiệp:

- 🟢 **Bambi Green (`#4CAF50`)**
  - *Vai trò:* Màu chủ đạo (Primary Theme Color). Dùng cho các thành phần chính của trang web (Header, Footer, Background sections, Tiêu đề chính).
  - *Ý nghĩa:* Tượng trưng cho sự phát triển, sinh sôi, môi trường giáo dục an toàn và lành mạnh. Màu xanh tạo cảm giác đáng tin cậy cho phụ huynh.

- 🟠 **Bambi Orange (`#FF6B35`)**
  - *Vai trò:* Màu nhấn trọng tâm (Primary Action / Accent). Chuyên dùng cho các nút bấm (Buttons), Call-to-Action (Đăng ký học, Hotline, Zalo), link nổi bật, và các icon cần thu hút sự chú ý.
  - *Ý nghĩa:* Mang lại nguồn năng lượng, sự nhiệt huyết, kích thích trẻ em khám phá và kích thích phụ huynh hành động.

- ⚪ **Trắng / Xám nhạt (Neutral Tones)**
  - *Vai trò:* Các màu nền trung tính (White, `#F9FAFB` hoặc `#F3F4F6`) được sử dụng để làm nền tảng, giúp tôn lên hai màu Xanh và Cam. Các màu như Vàng (`#FFD700`) được lược bỏ hoặc hạn chế tối đa chỉ dùng cho 1-2 icon đặc thù (như sao đánh giá).

*(Lưu ý: Màu `#ae2070` của MoMo chỉ xuất hiện duy nhất tại trang hoặc nút thanh toán liên quan trực tiếp đến MoMo, tuyệt đối không dùng làm màu trang trí).*

## 2. Nghệ Thuật Chữ (Typography)

Sự kết hợp font chữ hiện tại rất phù hợp với một trung tâm giáo dục trẻ em:

- **Display Font: `Nunito`** (Dùng cho H1, H2, H3)
  - *Đặc điểm:* Tròn trịa, hiện đại, thân thiện. Phù hợp cho các tiêu đề lớn cần sự chú ý mà không tạo cảm giác khô cứng.
- **Body Font: `Quicksand`** (Dùng cho Paragraph, span, text nội dung)
  - *Đặc điểm:* Rõ ràng, thoáng đãng, dễ đọc ở nhiều kích thước khác nhau.

---

## 3. Hướng Dẫn Thiết Kế Hiện Đại & Tinh Tế (Modern Redesign Guidelines)

Để ứng dụng bảng màu và font chữ trên vào một giao diện mang tính **"WOW" (Đẳng cấp, Premium)** nhưng vẫn giữ được nét trẻ trung, hãy áp dụng các nguyên tắc sau:

### 3.1. Phân Bổ Không Gian Trắng (Whitespace & Breathing Room)
- Tránh nhồi nhét quá nhiều thông tin ("Lớp học không vách ngăn" - thiết kế cũng vậy). 
- Sử dụng Padding và Margin lớn (vd: `py-16`, `py-24` trong Tailwind) giữa các khối (sections) để mang lại cảm giác rộng rãi, thoáng mát, cao cấp.

### 3.2. Hiệu ứng Chiều sâu & Glassmorphism
- **Shadows (Bóng đổ):** Tránh các bóng đen gắt. Thay vào đó, dùng bóng đổ màu nhạt có độ lan tỏa lớn (soft drop shadows) hoặc dùng bóng đổ cùng màu với element (ví dụ: nút bấm màu Cam thì bóng đổ là màu Cam với độ mờ `opacity-30`).
- **Glassmorphism:** Ở các khối (card) hiển thị đè lên một background gradient, hãy dùng hiệu ứng kính mờ (frosted glass) với lớp nền trắng trong suốt (`bg-white/70` kết hợp `backdrop-blur-md`). Điều này làm UI trông cực kỳ hiện đại.

### 3.3. Sử Dụng Gradient Cẩn Thận
- Đừng dùng màu trơn (solid) ở các mảng lớn (như Hero Banner). Hãy dùng gradient mượt mà. 
  - *Gợi ý:* Gradient từ `bambi-green` đậm sang nhạt, kết hợp với các điểm nhấn (accent) màu `bambi-orange` để tạo sự tương phản nổi bật. Hoặc một gradient nhẹ từ Xanh sang Cam nếu được xử lý opacity khéo léo (tuy nhiên ưu tiên dùng 1 màu gradient chính và màu còn lại làm điểm xuyết).
- Dùng `text-transparent bg-clip-text bg-gradient-to-r from-bambi-green to-bambi-orange` cho các tiêu đề quan trọng để tạo cảm giác sang trọng và gắn kết 2 màu thương hiệu.

### 3.4. Chuyển Động Siêu Nhỏ (Micro-Animations & Interactions)
UI cần phải có "sức sống", đặc biệt với trẻ em:
- **Hover effects:** Mọi nút bấm, mọi thẻ khóa học đều cần phản hồi khi di chuột vào (Ví dụ: `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`).
- **Nút bấm (Buttons):** Có thể thêm hiệu ứng `scale` nhẹ khi click (`active:scale-95`).
- **Loading / Skeleton:** Dùng các animation lấp lánh (shimmer effect) hoặc spinner ngộ nghĩnh thay vì icon xoay đơn điệu.

### 3.5. Hình Ảnh & Đồ Họa (Assets & Imagery)
- Tránh dùng các hình mẫu (stock photos) trông giả tạo. Hãy dùng hình ảnh vui nhộn với các góc bo tròn (Rounded corners: `rounded-2xl` hoặc `rounded-3xl`).
- Áp dụng các "Shapes" mềm mại (như hình dạng Blob) làm background phía sau các hình ảnh, đập tan sự vuông vức nhàm chán của thiết kế web truyền thống.

### 3.6. Tối Ưu UI/UX trên Mobile
- Các thẻ (Card) cần hiển thị dạng vuốt ngang (Carousel) trên mobile thay vì trải dài vô tận.
- Các nút CTA (Call to Action) như Hotline, Zalo luôn ở trạng thái "Sticky" phía dưới màn hình để phụ huynh dễ thao tác.
