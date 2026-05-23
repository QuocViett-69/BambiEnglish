import { Component, OnInit, signal } from '@angular/core';
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
  course = signal<Course | null>(null);
  loading = signal(false);
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
      (data) => this.course.set(data),
    );
  }

  get f() { return this.form.controls; }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);

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
        this.loading.set(false);
        alert('Có lỗi xảy ra khi kết nối cổng thanh toán MoMo, vui lòng thử lại!');
      },
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }
}
