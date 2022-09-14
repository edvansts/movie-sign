import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { TMediaTypes } from 'src/types';

export type TrendingDocument = Trending & Document;

@Schema()
export class Trending {
  @Prop({ required: true })
  type: TMediaTypes;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endedAt: Date;

  @Prop({ required: true })
  list: ObjectId[];
}

export const TrendingSchema = SchemaFactory.createForClass(Trending);
