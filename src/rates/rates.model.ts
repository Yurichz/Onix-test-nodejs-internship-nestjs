import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';

export type RateDocument = HydratedDocument<Rate>;

@Schema({
  timestamps: true,
})
export class Rate {
  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  usd: number;

  @Prop({ default: now() })
  updatedAt: Date;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
