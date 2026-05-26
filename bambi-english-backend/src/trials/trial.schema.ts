import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrialDocument = Trial & Document;

export enum TrialStatus {
  NEW = 'Mới',
  CONTACTED = 'Đã liên hệ',
  DONE = 'Đã xong',
}

@Schema({ timestamps: true })
export class Trial {
  @Prop({ required: true })
  parentName: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  studentName?: string;

  @Prop()
  studentAge?: string;

  @Prop()
  email?: string;

  @Prop()
  content?: string;

  @Prop({ enum: TrialStatus, default: TrialStatus.NEW })
  status: TrialStatus;

  @Prop()
  note?: string;
}

export const TrialSchema = SchemaFactory.createForClass(Trial);
