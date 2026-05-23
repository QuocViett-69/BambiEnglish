export interface CreateRegistrationDto {
  studentName: string;
  parentPhone: string;
  courseId: string;
}

export interface RegistrationResponse {
  message: string;
  orderId: string;
  paymentUrl: string;
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
  momoTransId: string | null;
  studentName: string;
}
