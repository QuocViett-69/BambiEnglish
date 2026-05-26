import { Routes } from '@angular/router';
import { HomeComponent }          from './pages/home/home.component';
import { LocationComponent }      from './pages/location/location.component';
import { InfoComponent }          from './pages/info/info.component';
import { FacilitiesComponent }    from './pages/facilities/facilities.component';
import { CoursesComponent }       from './pages/courses/courses.component';
import { CourseDetailComponent }  from './pages/course-detail/course-detail.component';
import { CheckoutComponent }      from './pages/checkout/checkout.component';
import { PaymentResultComponent } from './pages/payment-result/payment-result.component';
import { MockMomoComponent }      from './pages/mock-momo/mock-momo.component';
import { MockVnpayComponent }     from './pages/mock-vnpay/mock-vnpay.component';
import { ScheduleComponent }      from './pages/schedule/schedule.component';
import { ContactComponent }       from './pages/contact/contact.component';

import { AdminLayoutComponent }   from './admin/admin-layout/admin-layout.component';
import { AdminCoursesComponent }  from './admin/admin-courses/admin-courses.component';
import { AdminBranchesComponent } from './admin/admin-branches/admin-branches.component';
import { AdminTrialsComponent }   from './admin/admin-trials/admin-trials.component';
import { AdminSettingsComponent } from './admin/admin-settings/admin-settings.component';

export const routes: Routes = [
  // Admin Routes
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: AdminCoursesComponent, title: 'Quản lý Khóa học' },
      { path: 'branches', component: AdminBranchesComponent, title: 'Quản lý Cơ sở' },
      { path: 'trials', component: AdminTrialsComponent, title: 'Quản lý Đăng ký học thử' },
      { path: 'settings', component: AdminSettingsComponent, title: 'Cài đặt hệ thống' },
    ]
  },

  // Public Routes
  { path: '',               component: HomeComponent,          title: 'Bambi English – Trang chủ' },
  { path: 'dia-diem',       component: LocationComponent,      title: 'Địa điểm – Bambi English' },
  { path: 'thong-tin',      component: InfoComponent,          title: 'Thông tin – Bambi English' },
  { path: 'co-so-vat-chat', component: FacilitiesComponent,    title: 'CSVC – Bambi English' },
  { path: 'khoa-hoc',       component: CoursesComponent,       title: 'Khóa học – Bambi English' },
  { path: 'khoa-hoc/:id',   component: CourseDetailComponent,  title: 'Chi tiết khóa học' },
  { path: 'dang-ky/:id',    component: CheckoutComponent,      title: 'Đăng ký khóa học' },
  { path: 'payment-result', component: PaymentResultComponent, title: 'Kết quả thanh toán' },
  { path: 'mock-momo',      component: MockMomoComponent,      title: 'Cổng thanh toán MoMo' },
  { path: 'mock-vnpay',     component: MockVnpayComponent,     title: 'Cổng thanh toán VNPay' },
  { path: 'lich-hoc',       component: ScheduleComponent,      title: 'Lịch học' },
  { path: 'lien-he',        component: ContactComponent,       title: 'Liên hệ – Bambi English' },
  
  { path: '**',             redirectTo: '' },
];
