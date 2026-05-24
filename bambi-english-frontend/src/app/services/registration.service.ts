import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Gọi sau khi redirect về /payment-result để lấy trạng thái chính xác từ DB
  getPaymentStatus(orderId: string): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.baseUrl}/payment/status/${orderId}`,
    );
  }

  // Gửi toàn bộ params VNPay trả về cho backend để verify chữ ký & cập nhật DB
  verifyVnpayReturn(queryParams: Record<string, string>): Observable<{
    isVerified: boolean;
    isSuccess: boolean;
    orderId: string;
    message: string;
  }> {
    let params = new HttpParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      params = params.set(key, value);
    });
    return this.http.get<any>(`${this.baseUrl}/vnpay-return`, { params });
  }
}

