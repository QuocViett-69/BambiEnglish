# Phase 4 — Frontend UI & Integration (Components + API Services)

## Mục tiêu
Build đầy đủ UI cho các trang, kết nối Angular service với NestJS API, xử lý form đăng ký và luồng thanh toán **MoMo Sandbox**.

---

## 1. API Services

### `src/app/services/course.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}/courses`);
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.baseUrl}/courses/${id}`);
  }
}
```

### `src/app/services/registration.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateRegistrationDto,
  RegistrationResponse,
  PaymentStatusResponse,
} from '../models/registration.model';

@Injectable({ providedIn: 'root' })
export class RegistrationService {
  private baseUrl = 'http://localhost:3000/api/registrations';

  constructor(private http: HttpClient) {}

  register(dto: CreateRegistrationDto): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.baseUrl}/register`, dto);
  }

  // Gọi sau khi MoMo redirect về /payment-result để lấy trạng thái chính xác từ DB
  getPaymentStatus(orderId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.baseUrl}/payment/status/${orderId}`,
    );
  }
}
```

---

## 2. Home Page — Danh sách khóa học

### `src/app/pages/home/home.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  loading = true;

  constructor(private courseService: CourseService) {}

  ngOnInit() {
    this.courseService.getAll().subscribe({
      next: (data) => { this.courses = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency', currency: 'VND',
    }).format(price);
  }
}
```

### `src/app/pages/home/home.component.html`
```html
<!-- Hero Banner -->
<section class="bg-gradient-to-br from-bambi-orange to-yellow-400 text-white py-20 px-4">
  <div class="max-w-4xl mx-auto text-center">
    <h1 class="text-5xl font-black font-display mb-4 drop-shadow">
      🐦 Bambi English
    </h1>
    <p class="text-xl font-medium mb-8 opacity-90">
      Trung tâm Anh ngữ thiếu nhi – Học vui, nói giỏi, tự tin bay xa!
    </p>
    <a routerLink="/thong-tin"
       class="inline-block bg-white text-bambi-orange font-bold px-8 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
      Tìm hiểu thêm →
    </a>
  </div>
</section>

<!-- Courses Section -->
<section class="max-w-7xl mx-auto px-4 py-16">
  <h2 class="text-3xl font-black font-display text-center mb-10 text-gray-800">
    Các khóa học nổi bật
  </h2>

  <!-- Loading -->
  <div *ngIf="loading" class="flex justify-center py-20">
    <div class="w-12 h-12 border-4 border-bambi-orange border-t-transparent rounded-full animate-spin"></div>
  </div>

  <!-- Course Cards -->
  <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div
      *ngFor="let course of courses"
      class="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <img [src]="course.imageUrl" [alt]="course.title"
           class="w-full h-48 object-cover" />
      <div class="p-5">
        <h3 class="font-bold font-display text-lg text-gray-800 mb-2">{{ course.title }}</h3>
        <p class="text-gray-500 text-sm mb-4 line-clamp-2">{{ course.shortDescription }}</p>
        <div class="flex items-center justify-between">
          <span class="text-bambi-orange font-black text-xl">{{ formatPrice(course.price) }}</span>
          <a [routerLink]="['/khoa-hoc', course._id]"
             class="bg-bambi-orange text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-colors">
            Xem chi tiết
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 3. Course Detail Page

### `src/app/pages/course-detail/course-detail.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './course-detail.component.html',
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.courseService.getById(id).subscribe({
      next: (data) => { this.course = data; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
```

### `src/app/pages/course-detail/course-detail.component.html`
```html
<div class="max-w-3xl mx-auto px-4 py-12">
  <div *ngIf="loading" class="flex justify-center py-20">
    <div class="w-12 h-12 border-4 border-bambi-orange border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div *ngIf="course && !loading" class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <img [src]="course.imageUrl" [alt]="course.title" class="w-full h-64 object-cover" />
    <div class="p-8">
      <a routerLink="/" class="text-bambi-orange text-sm hover:underline">← Quay lại</a>
      <h1 class="text-3xl font-black font-display mt-3 mb-4 text-gray-800">{{ course.title }}</h1>
      <p class="text-gray-600 mb-6 leading-relaxed">{{ course.shortDescription }}</p>

      <div class="bg-bambi-light rounded-xl p-4 mb-8 flex items-center justify-between">
        <span class="text-gray-500 font-medium">Học phí / tháng</span>
        <span class="text-bambi-orange text-2xl font-black">{{ formatPrice(course.price) }}</span>
      </div>

      <a [routerLink]="['/dang-ky', course._id]"
         class="block w-full text-center bg-bambi-orange text-white font-bold py-4 rounded-xl text-lg hover:bg-orange-600 transition-colors shadow-md">
        🎉 Đăng ký ngay
      </a>
    </div>
  </div>
</div>
```

---

## 4. Checkout / Registration Form

### `src/app/pages/checkout/checkout.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { RegistrationService } from '../../services/registration.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  form: FormGroup;
  course: Course | null = null;
  loading = false;
  courseId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private courseService: CourseService,
    private registrationService: RegistrationService,
  ) {
    this.form = this.fb.group({
      studentName: ['', [Validators.required, Validators.minLength(2)]],
      parentPhone: ['', [
        Validators.required,
        Validators.pattern(/^(0[3|5|7|8|9])+([0-9]{8})$/),
      ]],
    });
  }

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.courseService.getById(this.courseId).subscribe(
      (data) => (this.course = data),
    );
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;

    this.registrationService.register({
      studentName: this.f['studentName'].value,
      parentPhone: this.f['parentPhone'].value,
      courseId:    this.courseId,
    }).subscribe({
      next: (res) => {
        // Redirect sang trang thanh toán MoMo Sandbox
        window.location.href = res.paymentUrl;
      },
      error: () => {
        this.loading = false;
        alert('Có lỗi xảy ra khi kết nối cổng thanh toán MoMo, vui lòng thử lại!');
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
```

### `src/app/pages/checkout/checkout.component.html`
```html
<div class="max-w-lg mx-auto px-4 py-12">
  <div class="bg-white rounded-2xl shadow-lg p-8">
    <h1 class="text-2xl font-black font-display text-gray-800 mb-2">📋 Đăng ký khóa học</h1>

    <!-- Course Summary -->
    <div *ngIf="course" class="bg-bambi-light rounded-xl p-4 mb-6">
      <p class="text-sm text-gray-500 mb-1">Khóa học đã chọn:</p>
      <p class="font-bold text-gray-800">{{ course.title }}</p>
      <p class="text-bambi-orange font-black mt-1">{{ formatPrice(course.price) }} / tháng</p>
    </div>

    <!-- Form -->
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">

      <!-- Student Name -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Họ tên học sinh *</label>
        <input
          formControlName="studentName"
          type="text"
          placeholder="Ví dụ: Nguyễn Bảo An"
          class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bambi-orange"
          [class.border-red-400]="f['studentName'].invalid && f['studentName'].touched"
        />
        <p *ngIf="f['studentName'].invalid && f['studentName'].touched"
           class="text-red-500 text-xs mt-1">
          Vui lòng nhập tên học sinh (ít nhất 2 ký tự)
        </p>
      </div>

      <!-- Parent Phone -->
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại phụ huynh *</label>
        <input
          formControlName="parentPhone"
          type="tel"
          placeholder="Ví dụ: 0901234567"
          class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bambi-orange"
          [class.border-red-400]="f['parentPhone'].invalid && f['parentPhone'].touched"
        />
        <p *ngIf="f['parentPhone'].invalid && f['parentPhone'].touched"
           class="text-red-500 text-xs mt-1">
          Số điện thoại không hợp lệ (định dạng VN: 09x, 08x, 07x, 03x, 05x)
        </p>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        [disabled]="form.invalid || loading"
        class="w-full bg-[#ae2070] text-white font-bold py-4 rounded-xl text-lg
               hover:bg-[#8f1a5c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
               flex items-center justify-center gap-2"
      >
        <span *ngIf="!loading" class="flex items-center gap-2">
          <!-- MoMo logo SVG mini -->
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="white"/>
            <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle"
                  font-size="9" font-weight="bold" fill="#ae2070">MoMo</text>
          </svg>
          Thanh toán qua MoMo
        </span>
        <span *ngIf="loading" class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          Đang kết nối MoMo...
        </span>
      </button>

      <p class="text-center text-xs text-gray-400 mt-2">
        🔒 Thanh toán an toàn qua cổng MoMo Sandbox (môi trường test)
      </p>
    </form>
  </div>
</div>
```

---

## 5. Payment Result Page

### `src/app/pages/payment-result/payment-result.component.ts`
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { PaymentStatusResponse } from '../../models/registration.model';

@Component({
  selector: 'app-payment-result',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-result.component.html',
})
export class PaymentResultComponent implements OnInit {
  // Trạng thái UI
  loading    = true;
  isSuccess  = false;
  isFailed   = false;

  // Dữ liệu kết quả
  orderId    = '';
  resultCode = '';
  message    = '';
  statusData: PaymentStatusResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
  ) {}

  ngOnInit() {
    // MoMo redirect về với các query params:
    // ?partnerCode=MOMO&orderId=BAMBI-XXXXXXXX&requestId=...
    // &amount=1800000&orderInfo=...&orderType=...
    // &transId=...&resultCode=0&message=Successful
    // &payType=webApp&responseTime=...&extraData=&signature=...
    const params = this.route.snapshot.queryParamMap;

    this.orderId    = params.get('orderId')    ?? '';
    this.resultCode = params.get('resultCode') ?? '';
    this.message    = params.get('message')    ?? '';

    if (!this.orderId) {
      // Không có query params → truy cập trực tiếp URL
      this.loading = false;
      this.isFailed = true;
      return;
    }

    // Gọi API backend để lấy trạng thái chính xác từ DB
    // (tránh giả mạo query params phía client)
    this.registrationService.getPaymentStatus(this.orderId).subscribe({
      next: (data) => {
        this.statusData = data;
        this.isSuccess  = data.paymentStatus === 'SUCCESS';
        this.isFailed   = data.paymentStatus === 'FAILED';
        this.loading    = false;
      },
      error: () => {
        // Fallback: dùng resultCode từ query string nếu API lỗi
        this.isSuccess = this.resultCode === '0';
        this.isFailed  = !this.isSuccess;
        this.loading   = false;
      },
    });
  }
}
```

### `src/app/pages/payment-result/payment-result.component.html`
```html
<div class="min-h-screen flex items-center justify-center px-4">

  <!-- Loading -->
  <div *ngIf="loading" class="text-center">
    <div class="w-16 h-16 border-4 border-[#ae2070] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
    <p class="text-gray-500">Đang xác nhận kết quả thanh toán...</p>
  </div>

  <!-- Thành công -->
  <div *ngIf="!loading && isSuccess"
       class="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
    <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span class="text-4xl">🎉</span>
    </div>
    <h1 class="text-2xl font-black font-display text-bambi-green mb-2">
      Thanh toán thành công!
    </h1>
    <p class="text-gray-500 mb-2">
      Chúc mừng <strong>{{ statusData?.studentName }}</strong> đã đăng ký khóa học tại Bambi English.
    </p>
    <p class="text-gray-400 text-sm mb-1">Mã đơn: <span class="font-mono font-bold text-gray-600">{{ orderId }}</span></p>
    <p *ngIf="statusData?.momoTransId" class="text-gray-400 text-sm mb-6">
      Mã giao dịch MoMo: <span class="font-mono font-bold text-[#ae2070]">{{ statusData?.momoTransId }}</span>
    </p>
    <p class="text-gray-500 text-sm mb-6">Chúng tôi sẽ liên hệ xác nhận lịch học sớm nhất!</p>
    <a routerLink="/"
       class="inline-block bg-bambi-orange text-white font-bold px-6 py-3 rounded-full hover:bg-orange-600 transition-colors">
      Về trang chủ
    </a>
  </div>

  <!-- Thất bại -->
  <div *ngIf="!loading && isFailed"
       class="bg-white rounded-2xl shadow-xl p-10 text-center max-w-sm w-full">
    <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <span class="text-4xl">❌</span>
    </div>
    <h1 class="text-2xl font-black font-display text-red-500 mb-2">
      Thanh toán thất bại
    </h1>
    <p class="text-gray-500 mb-2">{{ message || 'Giao dịch không thành công hoặc đã bị hủy.' }}</p>
    <p *ngIf="orderId" class="text-gray-400 text-sm mb-6">
      Mã đơn: <span class="font-mono">{{ orderId }}</span>
    </p>
    <div class="flex flex-col gap-3">
      <a [routerLink]="['/dang-ky']"
         class="inline-block bg-[#ae2070] text-white font-bold px-6 py-3 rounded-full hover:bg-[#8f1a5c] transition-colors">
        Thử lại
      </a>
      <a routerLink="/"
         class="inline-block text-gray-500 underline text-sm">
        Về trang chủ
      </a>
    </div>
  </div>

</div>
```

---

## 6. Các trang tĩnh còn lại

### Location Page (`dia-diem`)
```html
<!-- location.component.html -->
<div class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-black font-display mb-8 text-gray-800">📍 Địa điểm</h1>
  <div class="grid md:grid-cols-2 gap-6">
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="font-bold text-lg mb-2 text-bambi-orange">Cơ sở 1 – Quận 1</h2>
      <p class="text-gray-600">123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM</p>
      <p class="text-gray-500 text-sm mt-1">📞 028 3823 xxxx</p>
    </div>
    <div class="bg-white rounded-2xl shadow p-6">
      <h2 class="font-bold text-lg mb-2 text-bambi-orange">Cơ sở 2 – Quận 7</h2>
      <p class="text-gray-600">456 Nguyễn Thị Thập, P. Tân Phú, Q.7, TP.HCM</p>
      <p class="text-gray-500 text-sm mt-1">📞 028 5416 xxxx</p>
    </div>
  </div>
</div>
```

### Info Page (`thong-tin`)
```html
<!-- info.component.html -->
<div class="max-w-3xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-black font-display mb-6 text-gray-800">ℹ️ Về Bambi English</h1>
  <div class="bg-white rounded-2xl shadow p-8 space-y-4 text-gray-600 leading-relaxed">
    <p>Bambi English là trung tâm Anh ngữ chuyên biệt cho trẻ em từ 3–12 tuổi, thành lập năm 2018 tại TP.HCM.</p>
    <p>Chúng tôi ứng dụng phương pháp giảng dạy TPR (Total Physical Response) kết hợp công nghệ tương tác, giúp bé học tiếng Anh tự nhiên và vui vẻ như tiếng mẹ đẻ.</p>
    <p><strong class="text-bambi-orange">Tầm nhìn:</strong> Mỗi trẻ em Việt Nam đều tự tin giao tiếp tiếng Anh trước tuổi 12.</p>
  </div>
</div>
```

### Facilities Page (`co-so-vat-chat`)
```html
<!-- facilities.component.html -->
<div class="max-w-4xl mx-auto px-4 py-12">
  <h1 class="text-3xl font-black font-display mb-8 text-gray-800">🎓 Cơ sở vật chất</h1>
  <div class="grid md:grid-cols-3 gap-6">
    <div *ngFor="let item of facilities" class="bg-white rounded-2xl shadow p-6 text-center">
      <div class="text-4xl mb-3">{{ item.icon }}</div>
      <h3 class="font-bold text-gray-800 mb-1">{{ item.title }}</h3>
      <p class="text-gray-500 text-sm">{{ item.desc }}</p>
    </div>
  </div>
</div>
```

```typescript
// facilities.component.ts – thêm vào class:
facilities = [
  { icon: '🖥️', title: 'Phòng học thông minh', desc: 'Màn hình tương tác 75 inch, âm thanh vòm 5.1' },
  { icon: '📚', title: 'Thư viện sách', desc: 'Hơn 500 đầu sách thiếu nhi tiếng Anh các cấp độ' },
  { icon: '🎮', title: 'Góc vui học', desc: 'Board games, flashcards, puzzle tiếng Anh' },
];
```

---

## 7. Chạy toàn bộ hệ thống

### Terminal 1 – Backend
```bash
cd bambi-english-backend
npm run start:dev
# → http://localhost:3000/api
```

### Terminal 2 – Frontend
```bash
cd bambi-english-frontend
ng serve --open
# → http://localhost:4200
```

---

## 8. Luồng người dùng hoàn chỉnh (MoMo)

```
Trang chủ (/)
  → Xem danh sách khóa học
  → Click "Xem chi tiết" → /khoa-hoc/:id
  → Click "Đăng ký ngay" → /dang-ky/:id
  → Điền form (họ tên + SĐT) → Submit
  → Backend tạo orderId + HMAC signature → gọi MoMo API
  → Redirect sang trang thanh toán MoMo Sandbox
  → Người dùng thanh toán trên giao diện MoMo
  → MoMo POST IPN về /api/registrations/payment/ipn → DB cập nhật SUCCESS
  → MoMo redirect → /payment-result?orderId=BAMBI-XXX&resultCode=0
  → Frontend gọi GET /payment/status/:orderId → hiển thị kết quả 🎉
```

---

## ✅ Checklist hoàn thành dự án

- [ ] Backend chạy tại `localhost:3000`
- [ ] MongoDB có dữ liệu 3 khóa học
- [ ] `GET /api/courses` trả đúng data
- [ ] `POST /api/registrations/register` tạo record + nhận `paymentUrl` từ MoMo sandbox
- [ ] `POST /api/registrations/payment/ipn` xác thực signature + cập nhật DB
- [ ] `GET /api/registrations/payment/status/:orderId` trả trạng thái chính xác
- [ ] Angular chạy tại `localhost:4200`
- [ ] Header hiển thị đủ 5 nav items, active state đúng
- [ ] Home page hiển thị 3 khóa học từ API
- [ ] Form validation hoạt động (required + phone regex)
- [ ] Nút submit hiển thị đúng màu MoMo (#ae2070)
- [ ] Redirect sang MoMo Sandbox thành công
- [ ] Payment result page hiển thị tên học sinh + mã giao dịch MoMo sau khi redirect về

> 🎊 **MVP hoàn chỉnh!** Có thể mở rộng: thêm auth, admin dashboard, email notification.

---

## 📝 Tài khoản test MoMo Sandbox

Dùng thông tin sau để test thanh toán trên giao diện MoMo Sandbox:

| Trường | Giá trị |
|---|---|
| Số điện thoại | `0000000001` hoặc `0000000002` |
| Mật khẩu | `000000` |
| OTP | `000000` |

> Xem thêm tại: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
