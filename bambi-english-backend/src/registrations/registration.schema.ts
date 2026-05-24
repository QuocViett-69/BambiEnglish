import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RegistrationDocument = Registration & Document;

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED  = 'FAILED',
}

export enum PaymentMethod {
  MOMO  = 'momo',
  VNPAY = 'vnpay',
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

  // Phương thức thanh toán: 'momo' | 'vnpay'
  @Prop({ enum: PaymentMethod, default: PaymentMethod.MOMO })
  paymentMethod: PaymentMethod;

  // orderId dùng làm mã giao dịch gửi lên cổng thanh toán (VD: BAMBI-A1B2C3D4)
  @Prop()
  orderId: string;

  // momoTransId là mã giao dịch do MoMo trả về sau khi thanh toán thành công
  @Prop()
  momoTransId: string;

  // vnpayTransId là mã giao dịch do VNPay trả về sau khi thanh toán thành công
  @Prop()
  vnpayTransId: string;
}

export const RegistrationSchema = SchemaFactory.createForClass(Registration);
