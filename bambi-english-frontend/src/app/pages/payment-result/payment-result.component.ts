import { Component, OnInit, signal } from '@angular/core';
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
  loading    = signal(true);
  isSuccess  = signal(false);
  isFailed   = signal(false);

  // Dữ liệu kết quả
  orderId    = '';
  resultCode = '';
  message    = '';
  statusData = signal<PaymentStatusResponse | null>(null);

  constructor(
    private route: ActivatedRoute,
    private registrationService: RegistrationService,
  ) {}

  ngOnInit() {
    const params = this.route.snapshot.queryParamMap;

    this.orderId    = params.get('orderId')    ?? '';
    this.resultCode = params.get('resultCode') ?? '';
    this.message    = params.get('message')    ?? '';

    if (!this.orderId) {
      this.loading.set(false);
      this.isFailed.set(true);
      return;
    }

    // Gọi API backend để lấy trạng thái chính xác từ DB
    this.registrationService.getPaymentStatus(this.orderId).subscribe({
      next: (data) => {
        this.statusData.set(data);
        if (data.paymentStatus === 'SUCCESS') {
          this.isSuccess.set(true);
        } else if (data.paymentStatus === 'FAILED') {
          this.isFailed.set(true);
        } else {
          // PENDING: fallback to resultCode from query params
          this.isSuccess.set(this.resultCode === '0');
          this.isFailed.set(this.resultCode !== '0');
        }
        this.loading.set(false);
      },
      error: () => {
        // Fallback: dùng resultCode từ query string nếu API lỗi
        this.isSuccess.set(this.resultCode === '0');
        this.isFailed.set(this.resultCode !== '0');
        this.loading.set(false);
      },
    });
  }
}
