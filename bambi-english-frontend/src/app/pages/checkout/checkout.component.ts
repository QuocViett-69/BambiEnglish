import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  course = signal<Course | null>(null);
  loading = signal(false);
  courseId = '';

  // Phương thức thanh toán được chọn
  selectedMethod = signal<'momo' | 'vnpay'>('momo');

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
      (data) => this.course.set(data),
    );
  }

  get f() { return this.form.controls; }

  selectMethod(method: 'momo' | 'vnpay') {
    this.selectedMethod.set(method);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

    const method = this.selectedMethod();

    this.registrationService.register({
      studentName:   this.f['studentName'].value,
      parentPhone:   this.f['parentPhone'].value,
      courseId:      this.courseId,
      paymentMethod: method,
    }).subscribe({
      next: (res) => {
        if (method === 'momo') {
          // MoMo: dùng trang mock local vì sandbox MoMo bị lỗi trắng màn hình
          this.router.navigate(['/mock-momo'], {
            queryParams: {
              orderId:     res.orderId,
              amount:      this.course()?.price,
              courseTitle: this.course()?.title,
            },
          });
        } else {
          // VNPay: redirect thẳng tới cổng sandbox thật của VNPay
          window.location.href = res.paymentUrl;
        }
      },
      error: () => {
        this.loading.set(false);
        alert('Có lỗi xảy ra khi kết nối cổng thanh toán, vui lòng thử lại!');
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
