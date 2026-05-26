import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BranchDocument = Branch & Document;

@Schema({ timestamps: true })
export class Branch {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  openingHours: string;

  @Prop({ required: false })
  imageUrl: string;

  @Prop({ required: false })
  mapLink: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
