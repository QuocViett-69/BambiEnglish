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
