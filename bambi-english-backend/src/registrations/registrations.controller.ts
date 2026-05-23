import { Controller, Post, Get, Body, Param } from '@nestjs/common';
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

  // GET /api/registrations/payment/status/:orderId
  // Frontend gọi sau khi MoMo redirect về redirectUrl để lấy kết quả
  @Get('payment/status/:orderId')
  getPaymentStatus(@Param('orderId') orderId: string) {
    return this.registrationsService.getPaymentStatus(orderId);
  }
}
