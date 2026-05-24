export interface CreateRegistrationDto {
  studentName: string;
  parentPhone: string;
  courseId: string;
  paymentMethod: 'momo' | 'vnpay';
}

export interface RegistrationResponse {
  message: string;
  orderId: string;
  paymentUrl: string;
  paymentMethod: 'momo' | 'vnpay';
  // Chỉ có khi paymentMethod = 'vnpay' (dùng cho mock page)
  amount?: number;
  courseTitle?: string;
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
  paymentMethod?: 'momo' | 'vnpay';
  momoTransId: string | null;
  vnpayTransId?: string | null;
  studentName: string;
}
