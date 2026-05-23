# Phase 2 — Backend Logic (REST APIs + MoMo Sandbox)

## Mục tiêu
Implement 3 endpoints chính: `GET /api/courses`, `POST /api/registrations/register`, `POST /api/registrations/payment/ipn` và logic tạo MoMo payment URL qua **MoMo Test Sandbox**.

---

## Thông tin MoMo Sandbox

| Tham số | Giá trị |
|---|---|
| Endpoint | `https://test-payment.momo.vn/v2/gateway/api/create` |
| partnerCode | `MOMO` |
| accessKey | `F8BBA842ECF85` |
| secretKey | `K951B6PE1waDMi640xX08PD3vg6EkVlz` |
| requestType | `payWithMethod` |
| redirectUrl | `http://localhost:4200/payment-result` |
| ipnUrl | `http://localhost:3000/api/registrations/payment/ipn` |

> Thông tin trên là credentials **test chính thức** từ MoMo, dùng được trực tiếp ở môi trường sandbox. Không dùng cho production.

---

## 1. Courses Module

### `src/courses/courses.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course, CourseSchema } from './course.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
```

### `src/courses/courses.service.ts`
```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async findAll(): Promise<Course[]> {
    return this.courseModel.find({ status: 'active' }).exec();
  }

  async findById(id: string): Promise<Course> {
    return this.courseModel.findById(id).exec();
  }
}
```

### `src/courses/courses.controller.ts`
```typescript
import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  // GET /api/courses
  @Get()
  findAll() {
    return this.coursesService.findAll();
  }

  // GET /api/courses/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }
}
```

---

## 2. Registrations Module

### `src/registrations/registrations.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { RegistrationsController } from './registrations.controller';
import { RegistrationsService } from './registrations.service';
import { Registration, RegistrationSchema } from './registration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Registration.name, schema: RegistrationSchema },
    ]),
    HttpModule,
  ],
  controllers: [RegistrationsController],
  providers: [RegistrationsService],
})
export class RegistrationsModule {}
```

---

### `src/registrations/dto/create-registration.dto.ts`
```typescript
export class CreateRegistrationDto {
  studentName: string;
  parentPhone: string;
  courseId: string;
}
```

---

### `src/registrations/registrations.service.ts`
```typescript
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
  ) {}

  // ─── POST /api/registrations/register ───────────────────────────────────────
  async create(dto: CreateRegistrationDto) {
    // 1. Tạo orderId duy nhất
    const orderId   = `BAMBI-${uuidv4().slice(0, 8).toUpperCase()}`;
    const requestId = uuidv4();
    const orderInfo = 'Dang ky khoa hoc Bambi English';
    const extraData = '';

    // 2. Lấy giá khóa học (tạm dùng 0 nếu không query, hoặc truyền amount từ client)
    //    Ở đây ta query trực tiếp từ DB để lấy giá chính xác.
    //    (Cần import CoursesService hoặc trực tiếp dùng model — xem ghi chú bên dưới)
    //
    //    Để đơn giản trong phase này, amount được truyền từ body hoặc bạn có thể
    //    inject CoursesService. Ví dụ dưới dùng amount cố định 1800000 cho test:
    const amount = 1800000; // TODO: thay bằng course.price thực tế

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

  // ─── POST /api/registrations/payment/ipn ────────────────────────────────────
  // MoMo gọi endpoint này (server-to-server) sau khi người dùng thanh toán xong.
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
    if (resultCode === 0) {
      registration.paymentStatus = PaymentStatus.SUCCESS;
      registration.momoTransId   = String(transId);
      this.logger.log(`[MoMo IPN] ✅ Thanh toán thành công: ${orderId}`);
    } else {
      registration.paymentStatus = PaymentStatus.FAILED;
      this.logger.warn(`[MoMo IPN] ❌ Thanh toán thất bại (${resultCode}): ${message}`);
    }

    await registration.save();

    // 4. Trả về 200 OK cho MoMo (bắt buộc, nếu không MoMo sẽ gọi lại)
    return { resultCode: 0, message: 'Received' };
  }

  // ─── GET /api/registrations/payment/status/:orderId ─────────────────────────
  // Frontend gọi sau khi redirectUrl trả về để kiểm tra kết quả.
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
```

> **Ghi chú về `amount`:** Để lấy `course.price` chính xác, bạn có thể inject `CoursesService` vào `RegistrationsService` (export `CoursesService` từ `CoursesModule`, import `CoursesModule` vào `RegistrationsModule`) hoặc thêm field `amount` vào `CreateRegistrationDto` cho client tự gửi lên (kèm validation server-side).

---

### `src/registrations/registrations.controller.ts`
```typescript
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
```

---

## 3. Luồng hoạt động MoMo Sandbox

```
[Frontend] POST /api/registrations/register
        ↓
[Backend] Tạo orderId + chữ ký HMAC SHA256
        ↓
[Backend] POST https://test-payment.momo.vn/v2/gateway/api/create
        ↓
[MoMo]   Trả về { payUrl, resultCode: 0 }
        ↓
[Backend] Lưu Registration (PENDING) → trả payUrl về Frontend
        ↓
[Frontend] window.location.href = payUrl  (redirect sang trang MoMo)
        ↓
[User]   Thanh toán trên giao diện MoMo Sandbox
        ↓
[MoMo]   POST /api/registrations/payment/ipn  (server-to-server, có signature)
        ↓
[Backend] Xác thực signature → cập nhật DB → SUCCESS hoặc FAILED
        ↓
[MoMo]   Redirect người dùng → http://localhost:4200/payment-result?orderId=...&resultCode=0
        ↓
[Frontend] Đọc query params → gọi GET /payment/status/:orderId → hiển thị kết quả
```

---

## 4. Kiểm tra bằng curl

### Test GET courses
```bash
curl http://localhost:3000/api/courses
```

### Test POST register
```bash
curl -X POST http://localhost:3000/api/registrations/register \
  -H "Content-Type: application/json" \
  -d '{
    "studentName": "Nguyễn Bảo An",
    "parentPhone": "0901234567",
    "courseId": "<_id lấy từ GET courses>"
  }'
```

**Response mong đợi:**
```json
{
  "message": "Đăng ký thành công! Đang chuyển tới cổng thanh toán MoMo...",
  "orderId": "BAMBI-A1B2C3D4",
  "paymentUrl": "https://test-payment.momo.vn/v2/gateway/pay?..."
}
```

### Test GET payment status
```bash
curl http://localhost:3000/api/registrations/payment/status/BAMBI-A1B2C3D4
```

**Response mong đợi:**
```json
{
  "orderId": "BAMBI-A1B2C3D4",
  "paymentStatus": "SUCCESS",
  "momoTransId": "3190248369",
  "studentName": "Nguyễn Bảo An"
}
```

---

## ✅ Dấu hiệu thành công

- `GET /api/courses` trả về mảng 3 khóa học
- `POST /api/registrations/register` kết nối được MoMo sandbox và trả về `paymentUrl` dạng `https://test-payment.momo.vn/...`
- Terminal in log: `[MoMo] Response: { resultCode: 0, payUrl: "..." }`
- Sau khi thanh toán trên MoMo sandbox → IPN được gọi → DB cập nhật `paymentStatus: SUCCESS`

> Sau khi xác nhận API hoạt động đúng → chuyển sang **Phase 3**
