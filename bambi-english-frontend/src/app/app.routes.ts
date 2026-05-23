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

