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
  loading   = signal(true);
  isSuccess = signal(false);
  isFailed  = signal(false);

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

    // ─── Phát hiện đây là return từ VNPay sandbox (có vnp_TxnRef) ─────────────
    const vnpTxnRef       = params.get('vnp_TxnRef');
    const vnpResponseCode = params.get('vnp_ResponseCode');

    if (vnpTxnRef) {
      // VNPay redirect về: lấy toàn bộ query params để gửi backend verify
      this.orderId = vnpTxnRef;

      const allParams: Record<string, string> = {};
      params.keys.forEach(key => {
        const val = params.get(key);
        if (val !== null) allParams[key] = val;
      });

      // Gọi backend để verify chữ ký VNPay & cập nhật trạng thái DB
      this.registrationService.verifyVnpayReturn(allParams).subscribe({
        next: (verifyResult) => {
          // Sau khi backend verify, lấy trạng thái từ DB để hiện thị
          this.registrationService.getPaymentStatus(this.orderId).subscribe({
            next: (data) => {
              this.statusData.set(data);
              this.isSuccess.set(data.paymentStatus === 'SUCCESS');
              this.isFailed.set(data.paymentStatus !== 'SUCCESS');
              this.loading.set(false);
            },
            error: () => {
              // Fallback: dùng kết quả verify trực tiếp
              this.isSuccess.set(verifyResult.isSuccess);
              this.isFailed.set(!verifyResult.isSuccess);
              this.message = verifyResult.message ?? '';
              this.loading.set(false);
            },
          });
        },
        error: () => {
          // Nếu backend lỗi, fallback dùng vnp_ResponseCode
          const isOk = vnpResponseCode === '00';
          this.isSuccess.set(isOk);
          this.isFailed.set(!isOk);
          this.message = isOk ? '' : 'Giao dịch không thành công hoặc đã bị hủy.';
          this.loading.set(false);
        },
      });

    } else {
      // ─── MoMo redirect về (có orderId param) ──────────────────────────────────
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
            const isOk = this.resultCode === '0';
            this.isSuccess.set(isOk);
            this.isFailed.set(!isOk);
          }
          this.loading.set(false);
        },
        error: () => {
          const isOk = this.resultCode === '0';
          this.isSuccess.set(isOk);
          this.isFailed.set(!isOk);
          this.loading.set(false);
        },
      });
    }
  }

  // Lấy mã giao dịch phù hợp theo phương thức thanh toán
  get transactionId(): string | null {
    const data = this.statusData();
    if (!data) return null;
    if (data.paymentMethod === 'vnpay') return data.vnpayTransId ?? null;
    return data.momoTransId ?? null;
  }

  get providerLabel(): string {
    return (this.statusData()?.paymentMethod ?? '') === 'vnpay' ? 'VNPay' : 'MoMo';
  }

  get providerColor(): string {
    return (this.statusData()?.paymentMethod ?? '') === 'vnpay' ? '#005BAA' : '#ae2070';
  }
}
