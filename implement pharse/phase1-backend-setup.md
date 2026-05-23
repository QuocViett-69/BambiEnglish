# Phase 1 — Backend Setup (NestJS + MongoDB Schemas)

## Mục tiêu
Scaffold dự án NestJS, cấu hình MongoDB, tạo Mongoose Schemas cho `Course` và `Registration`, và seed 3 khóa học mẫu.

---

## 1. Terminal Commands — Tạo dự án

```bash
# Cài NestJS CLI (nếu chưa có)
npm i -g @nestjs/cli

# Tạo project
nest new bambi-english-backend
cd bambi-english-backend

# Cài dependencies
npm install @nestjs/mongoose mongoose @nestjs/config @nestjs/axios axios uuid crypto
npm install --save-dev @types/uuid

# Tạo modules, controllers, services
nest g module courses
nest g controller courses
nest g service courses

nest g module registrations
nest g controller registrations
nest g service registrations
```

---

## 2. Cấu trúc thư mục sau Phase 1

```
src/
├── courses/
│   ├── course.schema.ts
│   ├── courses.module.ts
│   ├── courses.controller.ts
│   └── courses.service.ts
├── registrations/
│   ├── registration.schema.ts
│   ├── registrations.module.ts
│   ├── registrations.controller.ts
│   └── registrations.service.ts
├── seed/
│   └── seed.service.ts
├── app.module.ts
└── main.ts
```

---

## 3. Code các file chính

### `src/courses/course.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  imageUrl: string;

  @Prop({ default: 'active' })
  status: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
```

---

### `src/registrations/registration.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RegistrationDocument = Registration & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED  = 'FAILED',
}

@Schema({ timestamps: true })
export class Registration {
  @Prop({ required: true })
  studentName: string;

  @Prop({ required: true })
  parentPhone: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  courseId: Types.ObjectId;

  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  // orderId dùng làm mã giao dịch gửi lên MoMo (VD: BAMBI-A1B2C3D4)
  @Prop()
  orderId: string;

  // momoTransId là mã giao dịch do MoMo trả về sau khi thanh toán thành công
  @Prop()
  momoTransId: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
```

> **Lưu ý thay đổi so với VNPAY:**
> - Đổi field `transactionId` → `orderId` (khớp với tham số MoMo)
> - Thêm field `momoTransId` lưu mã giao dịch MoMo trả về qua IPN
> - Thêm trạng thái `FAILED` để xử lý thanh toán thất bại

---

### `src/seed/seed.service.ts`
```typescript
import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from '../courses/course.schema';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.courseModel.countDocuments();
    if (count === 0) {
      await this.seedCourses();
    }
  }

  private async seedCourses() {
    const courses = [
      {
        title: 'English Starters – Mầm Chồi (3–5 tuổi)',
        shortDescription:
          'Khai mở ngôn ngữ qua bài hát, trò chơi và flashcard sinh động. Bé học từ vựng, phát âm chuẩn từ sớm.',
        price: 1800000,
        imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600',
      },
      {
        title: 'English Explorer – Búp Bê (6–8 tuổi)',
        shortDescription:
          'Kết hợp phonics và giao tiếp cơ bản. Học sinh tự tin đặt câu, hỏi – đáp trong tình huống đời thường.',
        price: 2400000,
        imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600',
      },
      {
        title: 'English Champion – Thiếu Niên (9–12 tuổi)',
        shortDescription:
          'Luyện 4 kỹ năng Nghe–Nói–Đọc–Viết chuyên sâu. Định hướng thi chứng chỉ Cambridge Starters / Movers.',
        price: 3200000,
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600',
      },
    ];

    await this.courseModel.insertMany(courses);
    this.logger.log('✅ Seeded 3 mock courses successfully!');
  }
}
```

---

### `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CoursesModule } from './courses/courses.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { SeedService } from './seed/seed.service';
import { Course, CourseSchema } from './courses/course.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bambi-english'),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    HttpModule,
    CoursesModule,
    RegistrationsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
```

---

### `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH'],
    credentials: true,
  });
  await app.listen(3000);
  console.log('🚀 Bambi English API running at http://localhost:3000/api');
}
bootstrap();
```

---

## 4. Chạy và kiểm tra

```bash
# Đảm bảo MongoDB đang chạy
mongod

# Chạy backend ở chế độ dev
npm run start:dev
```

### ✅ Dấu hiệu thành công
- Terminal hiện: `✅ Seeded 3 mock courses successfully!`
- Server lắng nghe tại: `http://localhost:3000`
- Không có lỗi kết nối MongoDB

> Sau khi xác nhận OK → chuyển sang **Phase 2**
