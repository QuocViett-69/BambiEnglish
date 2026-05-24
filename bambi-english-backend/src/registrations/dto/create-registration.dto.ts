export class CreateRegistrationDto {
  studentName: string;
  parentPhone: string;
  courseId: string;
  paymentMethod: 'momo' | 'vnpay'; // 'momo' hoặc 'vnpay'
}
