import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('registrations')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  // POST /api/registrations/register
  @Post('register')
  create(@Body() dto: CreateRegistrationDto) {
    return this.registrationsService.create(dto);
  }

  // POST /api/registrations/payment/ipn
  // MoMo gọi endpoint này sau khi người dùng thanh toán (server-to-server)
  @Post('payment/ipn')
  handleMomoIpn(@Body() body: any) {
    return this.registrationsService.handleMomoIpn(body);
  }

  // POST /api/registrations/mock-payment
  // Giả lập giao dịch thanh toán MoMo thành công
  @Post('mock-payment')
  mockPayment(@Body() body: { orderId: string }) {
    return this.registrationsService.mockPaymentSuccess(body.orderId);
  }

  // POST /api/registrations/mock-vnpay-payment
  // Giả lập giao dịch thanh toán VNPay thành công
  @Post('mock-vnpay-payment')
  mockVnpayPayment(@Body() body: { orderId: string }) {
    return this.registrationsService.mockVnpaySuccess(body.orderId);
  }

  // GET /api/registrations/vnpay-return
  // VNPay redirect về URL này sau khi thanh toán (hoặc backend xử lý verify)
  @Get('vnpay-return')
  handleVnpayReturn(@Query() query: Record<string, string>) {
    return this.registrationsService.handleVnpayReturn(query);
  }

  // GET /api/registrations/payment/status/:orderId
  // Frontend gọi sau khi redirect về để lấy kết quả chính xác từ DB
  @Get('payment/status/:orderId')
  getPaymentStatus(@Param('orderId') orderId: string) {
    return this.registrationsService.getPaymentStatus(orderId);
  }
}
