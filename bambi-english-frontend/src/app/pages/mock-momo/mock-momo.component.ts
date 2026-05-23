import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mock-momo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mock-momo.component.html'
})
export class MockMomoComponent implements OnInit {
  orderId = '';
  amount = '';
  courseTitle = '';

  step = signal<1 | 2>(1); // 1: Nhập thẻ, 2: Nhập OTP
  loading = signal(false);

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;
    this.orderId = params.get('orderId') || '';
    this.amount = params.get('amount') || '';
    this.courseTitle = params.get('courseTitle') || '';
  }

  formatPrice(priceStr: string): string {
    const price = Number(priceStr);
    if (isNaN(price)) return priceStr;
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  nextStep() {
    this.loading.set(true);
    setTimeout(() => {
      this.step.set(2);
      this.loading.set(false);
    }, 1500);
  }

  submitOTP() {
    this.loading.set(true);
    // Gọi API để update trạng thái đơn hàng thành công
    this.http.post('http://localhost:3000/api/registrations/mock-payment', { orderId: this.orderId })
      .subscribe({
        next: () => {
          this.router.navigate(['/payment-result'], {
            queryParams: { orderId: this.orderId, resultCode: '0' }
          });
        },
        error: () => {
          this.loading.set(false);
          alert('Lỗi xác thực OTP!');
        }
      });
  }
}
