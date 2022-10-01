import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { TMediaTypes } from 'src/types';

@Schema({ versionKey: false })
class Trending {
  @Prop({ required: true })
  type: TMediaTypes;

  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endedAt: Date;

  @Prop({ required: true })
  list: ObjectId[];
}

const TrendingSchema = SchemaFactory.createForClass(Trending);

export type TrendingDocument = Trending & Document;
export { TrendingSchema, Trending };
