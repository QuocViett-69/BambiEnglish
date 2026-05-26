import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BranchDocument = Branch & Document;

export class Review {
  @Prop({ required: true })
  author: string;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({ required: false })
  date: string;

  @Prop({ required: false })
  avatar: string;
}

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

  @Prop({ type: [Object], default: [] })
  reviews: Review[];
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
