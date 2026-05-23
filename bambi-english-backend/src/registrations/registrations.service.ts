import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import {
  Registration,
  RegistrationDocument,
  PaymentStatus,
} from './registration.schema';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { CoursesService } from '../courses/courses.service';

// ─── MoMo Sandbox Credentials ────────────────────────────────────────────────
const MOMO_PARTNER_CODE  = 'MOMO';
const MOMO_ACCESS_KEY    = 'F8BBA842ECF85';
const MOMO_SECRET_KEY    = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const MOMO_ENDPOINT      = 'https://test-payment.momo.vn/v2/gateway/api/create';
const MOMO_REDIRECT_URL  = 'http://localhost:4200/payment-result';
const MOMO_IPN_URL       = 'http://localhost:3000/api/registrations/payment/ipn';
const MOMO_REQUEST_TYPE  = 'payWithMethod';
// ─────────────────────────────────────────────────────────────────────────────

@Injectable()
export class RegistrationsService {
  private readonly logger = new Logger(RegistrationsService.name);

  constructor(
    @InjectModel(Registration.name)
    private registrationModel: Model<RegistrationDocument>,
    private readonly httpService: HttpService,
    private readonly coursesService: CoursesService,
  ) {}

  // ─── POST /api/registrations/register ───────────────────────────────────────
  async create(dto: CreateRegistrationDto) {
    // 1. Query course from DB to resolve amount dynamically
    const course = await this.coursesService.findById(dto.courseId);
    if (!course) {
      throw new NotFoundException(`Không tìm thấy khóa học với ID: ${dto.courseId}`);
    }
    const amount = course.price;

    // 2. Tạo orderId duy nhất
    const orderId   = `BAMBI-${uuidv4().slice(0, 8).toUpperCase()}`;
    const requestId = uuidv4();
    const orderInfo = `Dang ky khoa hoc ${course.title}`;
    const extraData = '';

    // 3. Tạo chữ ký HMAC SHA256
    const rawSignature =
      `accessKey=${MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${MOMO_IPN_URL}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${MOMO_PARTNER_CODE}` +
      `&redirectUrl=${MOMO_REDIRECT_URL}` +
      `&requestId=${requestId}` +
      `&requestType=${MOMO_REQUEST_TYPE}`;

    const signature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    this.logger.debug(`[MoMo] rawSignature: ${rawSignature}`);
    this.logger.debug(`[MoMo] signature: ${signature}`);

    // 4. Gọi MoMo API
    const requestBody = {
      partnerCode:  MOMO_PARTNER_CODE,
      partnerName:  'Bambi English',
      storeId:      'BambiEnglishStore',
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl:  MOMO_REDIRECT_URL,
      ipnUrl:       MOMO_IPN_URL,
      lang:         'vi',
      requestType:  MOMO_REQUEST_TYPE,
      autoCapture:  true,
      extraData,
      signature,
    };

    let payUrl: string;
    try {
      const response = await firstValueFrom(
        this.httpService.post(MOMO_ENDPOINT, requestBody, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      const momoResponse = response.data;
      this.logger.log(`[MoMo] Response: ${JSON.stringify(momoResponse)}`);

      if (momoResponse.resultCode !== 0) {
        throw new InternalServerErrorException(
          `MoMo từ chối tạo thanh toán: ${momoResponse.message}`,
        );
      }

      payUrl = momoResponse.payUrl;
    } catch (error) {
      this.logger.error('[MoMo] Lỗi kết nối tới MoMo API', error?.message);
      throw new InternalServerErrorException('Không thể kết nối cổng thanh toán MoMo');
    }

    // 5. Lưu đăng ký vào DB
    const registration = new this.registrationModel({
      studentName:   dto.studentName,
      parentPhone:   dto.parentPhone,
      courseId:      dto.courseId,
      paymentStatus: PaymentStatus.PENDING,
      orderId,
    });
    await registration.save();

    return {
      message:   'Đăng ký thành công! Đang chuyển tới cổng thanh toán MoMo...',
      orderId,
      paymentUrl: payUrl,
    };
  }

  // ─── MOCK PAYMENT SUCCESS ───────────────────────────────────────────────────
  async mockPaymentSuccess(orderId: string) {
    const registration = await this.registrationModel.findOne({ orderId });
    if (!registration) {
      throw new NotFoundException(`Không tìm thấy đơn đăng ký: ${orderId}`);
    }
    
    registration.paymentStatus = PaymentStatus.SUCCESS;
    registration.momoTransId   = `MOCK-${Date.now()}`;
    await registration.save();
    
    return { success: true };
  }

  // ─── POST /api/registrations/payment/ipn ────────────────────────────────────
  async handleMomoIpn(body: any) {
    this.logger.log(`[MoMo IPN] Nhận callback: ${JSON.stringify(body)}`);

    const {
      orderId,
      resultCode,
      transId,
      amount,
      message,
      signature: receivedSignature,
    } = body;

    // 1. Xác thực chữ ký từ MoMo
    const rawSignature =
      `accessKey=${MOMO_ACCESS_KEY}` +
      `&amount=${amount}` +
      `&extraData=${body.extraData ?? ''}` +
      `&message=${message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${body.orderInfo}` +
      `&orderType=${body.orderType}` +
      `&partnerCode=${MOMO_PARTNER_CODE}` +
      `&payType=${body.payType}` +
      `&requestId=${body.requestId}` +
      `&responseTime=${body.responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${transId}`;

    const expectedSignature = crypto
      .createHmac('sha256', MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest('hex');

    if (receivedSignature !== expectedSignature) {
      this.logger.warn('[MoMo IPN] Chữ ký không hợp lệ! Bỏ qua request.');
      return { resultCode: 99, message: 'Invalid signature' };
    }

    // 2. Tìm đăng ký theo orderId
    const registration = await this.registrationModel.findOne({ orderId });
    if (!registration) {
      this.logger.warn(`[MoMo IPN] Không tìm thấy đơn: ${orderId}`);
      return { resultCode: 99, message: 'Order not found' };
    }

    // 3. Cập nhật trạng thái
    if (Number(resultCode) === 0) {
      registration.paymentStatus = PaymentStatus.SUCCESS;
      registration.momoTransId   = String(transId);
      this.logger.log(`[MoMo IPN] ✅ Thanh toán thành công: ${orderId}`);
    } else {
      registration.paymentStatus = PaymentStatus.FAILED;
      this.logger.warn(`[MoMo IPN] ❌ Thanh toán thất bại (${resultCode}): ${message}`);
    }

    await registration.save();

    return { resultCode: 0, message: 'Received' };
  }

  // ─── GET /api/registrations/payment/status/:orderId ─────────────────────────
  async getPaymentStatus(orderId: string) {
    const registration = await this.registrationModel
      .findOne({ orderId })
      .populate('courseId');

    if (!registration) {
      throw new NotFoundException(`Không tìm thấy đơn đăng ký: ${orderId}`);
    }

    return {
      orderId,
      paymentStatus: registration.paymentStatus,
      momoTransId:   registration.momoTransId ?? null,
      studentName:   registration.studentName,
    };
  }
}
