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
import { VNPay, ProductCode, HashAlgorithm } from 'vnpay';
import {
  Registration,
  RegistrationDocument,
  PaymentStatus,
  PaymentMethod,
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

// ─── VNPay Sandbox Credentials ───────────────────────────────────────────────
const VNPAY_TMN_CODE    = 'B7MZSRZN';
const VNPAY_HASH_SECRET = 'N6EHMKL4RN3B3JAB7DG75R0U7VMVLKEH';
// Dùng ngrok URL để VNPay sandbox redirect được (không chấp nhận localhost)
const VNPAY_RETURN_URL  = 'https://lowell-intercerebral-monopodially.ngrok-free.dev/payment-result';
// ─────────────────────────────────────────────────────────────────────────────

// Khởi tạo VNPay client một lần duy nhất
const vnpay = new VNPay({
  tmnCode: VNPAY_TMN_CODE,
  secureSecret: VNPAY_HASH_SECRET,
  vnpayHost: 'https://sandbox.vnpayment.vn',
  testMode: true,
  hashAlgorithm: HashAlgorithm.SHA512,
  enableLog: false,
});

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

    const method = dto.paymentMethod ?? 'momo';
    if (method === 'vnpay') {
      return this._createVnpayPayment(dto, course);
    }
    return this._createMomoPayment(dto, course);
  }

  // ─── PRIVATE: Tạo thanh toán MoMo ──────────────────────────────────────────
  private async _createMomoPayment(dto: CreateRegistrationDto, course: any) {
    const amount    = course.price;
    const orderId   = `BAMBI-${uuidv4().slice(0, 8).toUpperCase()}`;
    const requestId = uuidv4();
    const orderInfo = `Dang ky khoa hoc ${course.title}`;
    const extraData = '';

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

    // Lưu đăng ký vào DB
    const registration = new this.registrationModel({
      studentName:   dto.studentName,
      parentPhone:   dto.parentPhone,
      courseId:      dto.courseId,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.MOMO,
      orderId,
    });
    await registration.save();

    return {
      message:      'Đăng ký thành công! Đang chuyển tới cổng thanh toán MoMo...',
      orderId,
      paymentUrl:   payUrl,
      paymentMethod: 'momo',
    };
  }

  // ─── PRIVATE: Tạo thanh toán VNPay ─────────────────────────────────────────
  private async _createVnpayPayment(dto: CreateRegistrationDto, course: any) {
    const amount  = course.price;
    const orderId = `BAMBI-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Lấy IP (sandbox cho phép dùng IP cứng)
    const ipAddr = '127.0.0.1';

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount:    amount,
      vnp_IpAddr:    ipAddr,
      vnp_TxnRef:    orderId,
      vnp_OrderInfo: `Dang ky khoa hoc ${course.title}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: VNPAY_RETURN_URL,
    });

    this.logger.log(`[VNPay] Payment URL created for order: ${orderId}`);

    // Lưu đăng ký vào DB
    const registration = new this.registrationModel({
      studentName:   dto.studentName,
      parentPhone:   dto.parentPhone,
      courseId:      dto.courseId,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: PaymentMethod.VNPAY,
      orderId,
    });
    await registration.save();

    return {
      message:      'Đăng ký thành công! Đang chuyển tới cổng thanh toán VNPay...',
      orderId,
      paymentUrl,
      paymentMethod: 'vnpay',
      // Trả thêm để mock page có thể dùng
      amount,
      courseTitle: course.title,
    };
  }

  // ─── MOCK MOMO PAYMENT SUCCESS ──────────────────────────────────────────────
  async mockPaymentSuccess(orderId: string) {
    const registration = await this.registrationModel.findOne({ orderId });
    if (!registration) {
      throw new NotFoundException(`Không tìm thấy đơn đăng ký: ${orderId}`);
    }
    
    registration.paymentStatus = PaymentStatus.SUCCESS;
    registration.momoTransId   = `MOCK-MOMO-${Date.now()}`;
    await registration.save();
    
    return { success: true };
  }

  // ─── MOCK VNPAY PAYMENT SUCCESS ─────────────────────────────────────────────
  async mockVnpaySuccess(orderId: string) {
    const registration = await this.registrationModel.findOne({ orderId });
    if (!registration) {
      throw new NotFoundException(`Không tìm thấy đơn đăng ký: ${orderId}`);
    }
    
    registration.paymentStatus = PaymentStatus.SUCCESS;
    registration.vnpayTransId  = `MOCK-VNPAY-${Date.now()}`;
    await registration.save();
    
    return { success: true };
  }

  // ─── POST /api/registrations/payment/ipn (MoMo) ─────────────────────────────
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

  // ─── GET /api/registrations/vnpay-return ────────────────────────────────────
  async handleVnpayReturn(query: Record<string, string>) {
    this.logger.log(`[VNPay Return] Query: ${JSON.stringify(query)}`);

    try {
      const verify = vnpay.verifyReturnUrl(query as any);
      const orderId = query['vnp_TxnRef'];
      const vnp_ResponseCode = query['vnp_ResponseCode'];

      const registration = await this.registrationModel.findOne({ orderId });
      if (registration) {
        if (verify.isVerified && verify.isSuccess && vnp_ResponseCode === '00') {
          registration.paymentStatus = PaymentStatus.SUCCESS;
          registration.vnpayTransId  = query['vnp_TransactionNo'] ?? `VNPAY-${Date.now()}`;
        } else {
          registration.paymentStatus = PaymentStatus.FAILED;
        }
        await registration.save();
      }

      return {
        isVerified: verify.isVerified,
        isSuccess:  verify.isSuccess && vnp_ResponseCode === '00',
        orderId,
        message:    verify.message,
      };
    } catch (error) {
      this.logger.error('[VNPay Return] Lỗi xác thực', error?.message);
      return { isVerified: false, isSuccess: false, message: 'Verify error' };
    }
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
      paymentStatus:  registration.paymentStatus,
      paymentMethod:  registration.paymentMethod,
      momoTransId:    registration.momoTransId   ?? null,
      vnpayTransId:   registration.vnpayTransId  ?? null,
      studentName:    registration.studentName,
    };
  }

  // ─── GET /api/registrations/all — Admin ────────────────────────────────────
  async findAll() {
    return this.registrationModel
      .find()
      .populate('courseId', 'title price')
      .sort({ createdAt: -1 })
      .exec();
  }
}
