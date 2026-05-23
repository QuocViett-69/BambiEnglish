# Phase 3 — Frontend Setup & Routing (Angular + Tailwind CSS)

## Mục tiêu
Scaffold Angular app, cấu hình Tailwind CSS, thiết lập routing cho 6 trang chính, tạo `HeaderComponent` với navigation giống thiết kế.

---

## 1. Terminal Commands — Tạo dự án Angular

```bash
# Cài Angular CLI (nếu chưa có)
npm install -g @angular/cli

# Tạo Angular project
ng new bambi-english-frontend --routing=true --style=css
cd bambi-english-frontend

# Cài Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init

# Cài thêm thư viện hỗ trợ
npm install @angular/forms @angular/common
```

---

## 2. Cấu hình Tailwind CSS

### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        bambi: {
          green:  '#4CAF50',
          orange: '#FF6B35',
          yellow: '#FFD700',
          light:  '#FFF8F0',
        },
        momo: '#ae2070',
      },
      fontFamily: {
        display: ['"Nunito"', 'sans-serif'],
        body:    ['"Quicksand"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### `src/styles.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Quicksand:wght@400;500;600;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: 'Quicksand', sans-serif;
  background-color: #FFF8F0;
  color: #2d2d2d;
}

h1, h2, h3, h4 {
  font-family: 'Nunito', sans-serif;
}
```

---

## 3. Cấu trúc thư mục

```
src/app/
├── components/
│   ├── header/
│   │   ├── header.component.ts
│   │   └── header.component.html
│   └── footer/
│       ├── footer.component.ts
│       └── footer.component.html
├── pages/
│   ├── home/
│   │   ├── home.component.ts
│   │   └── home.component.html
│   ├── location/
│   │   ├── location.component.ts
│   │   └── location.component.html
│   ├── info/
│   │   ├── info.component.ts
│   │   └── info.component.html
│   ├── facilities/
│   │   ├── facilities.component.ts
│   │   └── facilities.component.html
│   ├── course-detail/
│   │   ├── course-detail.component.ts
│   │   └── course-detail.component.html
│   ├── checkout/
│   │   ├── checkout.component.ts
│   │   └── checkout.component.html
│   └── payment-result/
│       ├── payment-result.component.ts
│       └── payment-result.component.html
├── services/
│   ├── course.service.ts
│   └── registration.service.ts
├── models/
│   ├── course.model.ts
│   └── registration.model.ts
├── app.routes.ts
├── app.config.ts
└── app.component.ts
```

---

## 4. Tạo components & pages

```bash
# Shared components
ng g component components/header
ng g component components/footer

# Pages
ng g component pages/home
ng g component pages/location
ng g component pages/info
ng g component pages/facilities
ng g component pages/course-detail
ng g component pages/checkout
ng g component pages/payment-result

# Services
ng g service services/course
ng g service services/registration
```

---

## 5. Models (TypeScript interfaces)

### `src/app/models/course.model.ts`
```typescript
export interface Course {
  _id: string;
  title: string;
  shortDescription: string;
  price: number;
  imageUrl: string;
  status: string;
}
```

### `src/app/models/registration.model.ts`
```typescript
export interface CreateRegistrationDto {
  studentName: string;
  parentPhone: string;
  courseId: string;
}

export interface RegistrationResponse {
  message: string;
  orderId: string;
  paymentUrl: string;
}

// Trạng thái thanh toán MoMo trả về qua query params khi redirect
export interface MomoRedirectParams {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: string;
  orderInfo: string;
  orderType: string;
  transId: string;
  resultCode: string;   // '0' = thành công, khác = thất bại
  message: string;
  payType: string;
  responseTime: string;
  extraData: string;
  signature: string;
}

// Kết quả trả về từ GET /api/registrations/payment/status/:orderId
export interface PaymentStatusResponse {
  orderId: string;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED';
  momoTransId: string | null;
  studentName: string;
}
```

> **Thay đổi so với VNPAY:**
> - `transactionId` → `orderId` (khớp với MoMo)
> - Thêm `MomoRedirectParams` để parse query string khi MoMo redirect về
> - Thêm `PaymentStatusResponse` để hiển thị kết quả trên trang `/payment-result`

---

## 6. Routing

### `src/app/app.routes.ts`
```typescript
import { Routes } from '@angular/router';
import { HomeComponent }          from './pages/home/home.component';
import { LocationComponent }      from './pages/location/location.component';
import { InfoComponent }          from './pages/info/info.component';
import { FacilitiesComponent }    from './pages/facilities/facilities.component';
import { CourseDetailComponent }  from './pages/course-detail/course-detail.component';
import { CheckoutComponent }      from './pages/checkout/checkout.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';

export const routes: Routes = [
  { path: '',               component: HomeComponent,          title: 'Bambi English – Trang chủ' },
  { path: 'dia-diem',       component: LocationComponent,      title: 'Địa điểm – Bambi English' },
  { path: 'thong-tin',      component: InfoComponent,          title: 'Thông tin – Bambi English' },
  { path: 'co-so-vat-chat', component: FacilitiesComponent,    title: 'CSVC – Bambi English' },
  { path: 'khoa-hoc/:id',   component: CourseDetailComponent,  title: 'Chi tiết khóa học' },
  { path: 'dang-ky/:id',    component: CheckoutComponent,      title: 'Đăng ký khóa học' },
  // MoMo redirect về URL này với query params: ?orderId=...&resultCode=0&transId=...
  { path: 'payment-result', component: PaymentResultComponent, title: 'Kết quả thanh toán' },
  { path: '**',             redirectTo: '' },
];
```

---

## 7. App Config (HttpClient)

### `src/app/app.config.ts`
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
  ],
};
```

---

## 8. Header Component

### `src/app/components/header/header.component.ts`
```typescript
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  navItems = [
    { label: 'Trang chủ',    route: '/',               icon: '🏠' },
    { label: 'Địa điểm',     route: '/dia-diem',        icon: '📍' },
    { label: 'Thông tin',    route: '/thong-tin',       icon: 'ℹ️' },
    { label: 'CSVC',         route: '/co-so-vat-chat',  icon: '🎓' },
    { label: 'Đăng ký',      route: '/dang-ky',         icon: '📋' },
  ];

  mobileMenuOpen = false;
  toggleMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }
}
```

### `src/app/components/header/header.component.html`
```html
<header class="bg-white shadow-md sticky top-0 z-50">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

    <!-- Logo -->
    <a routerLink="/" class="flex items-center gap-2">
      <span class="text-2xl font-black font-display text-bambi-orange">
        Bambi <span class="text-bambi-green">English</span>
      </span>
    </a>

    <!-- Desktop Nav -->
    <nav class="hidden md:flex items-center gap-6">
      <a
        *ngFor="let item of navItems"
        [routerLink]="item.route"
        routerLinkActive="text-bambi-orange font-bold border-b-2 border-bambi-orange"
        [routerLinkActiveOptions]="{ exact: item.route === '/' }"
        class="flex flex-col items-center gap-0.5 text-sm text-gray-600 hover:text-bambi-orange transition-colors pb-1"
      >
        <span class="text-xl">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </a>
    </nav>

    <!-- Mobile Hamburger -->
    <button class="md:hidden text-gray-600 text-2xl" (click)="toggleMenu()">
      {{ mobileMenuOpen ? '✕' : '☰' }}
    </button>
  </div>

  <!-- Mobile Menu -->
  <div *ngIf="mobileMenuOpen" class="md:hidden bg-white border-t px-4 py-3 flex flex-col gap-3">
    <a
      *ngFor="let item of navItems"
      [routerLink]="item.route"
      (click)="toggleMenu()"
      class="flex items-center gap-3 text-gray-700 hover:text-bambi-orange font-medium py-1"
    >
      <span>{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </a>
  </div>
</header>
```

---

## 9. App Component (root layout)

### `src/app/app.component.html`
```html
<app-header></app-header>
<main class="min-h-screen">
  <router-outlet></router-outlet>
</main>
<app-footer></app-footer>
```

### `src/app/app.component.ts`
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
```

---

## 10. Chạy và kiểm tra

```bash
ng serve --open
```

### ✅ Dấu hiệu thành công
- App chạy tại `http://localhost:4200`
- Header hiển thị đúng 5 nav items: Trang chủ, Địa điểm, Thông tin, CSVC, Đăng ký
- Click từng nav → URL thay đổi đúng route
- Route `/payment-result` sẵn sàng nhận query params từ MoMo redirect
- Responsive: hamburger menu hoạt động trên mobile

> Sau khi xác nhận routing hoạt động → chuyển sang **Phase 4**
