import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { TDepartmentWorked, TGender } from 'src/types';

export type CastDocument = Cast & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Cast {
  @Prop({ required: true })
  name: string;

  @Prop()
  gender?: TGender;

  @Prop({ required: true })
  lastPopularity: number;

  @Prop()
  profileImage: string | null;

  @Prop()
  departmentWorked: TDepartmentWorked;

  @Prop()
  order: number;

  @Prop()
  character: string;

  @Prop()
  tmdbId: string | null;

  @Prop({ required: true, type: 'string' })
  movieId: ObjectId;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
