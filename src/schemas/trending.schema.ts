import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { MEDIA_TYPE } from 'src/types';

@Schema({ versionKey: false, timestamps: true })
class Trending {
  @Prop({ required: true })
  type: MEDIA_TYPE;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endedAt: Date;

  @Prop({ required: true })
  list: ObjectId[];

  @Prop({ type: Date, expires: '12 w' })
  createdAt?: Date;
}

const TrendingSchema = SchemaFactory.createForClass(Trending);

export type TrendingDocument = Trending & Document;
export { TrendingSchema, Trending };
