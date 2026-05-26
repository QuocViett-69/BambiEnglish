import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ default: 'Bambi English' })
  centerName: string;

  @Prop({ default: '1900 8888' })
  hotline: string;

  @Prop({ default: 'tuvan@bambi.edu.vn' })
  email: string;

  @Prop({ default: '' })
  logoUrl: string;

  @Prop({ default: '' })
  facebookLink: string;

  @Prop({ default: '' })
  youtubeLink: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
