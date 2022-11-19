import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types } from 'mongoose';
import { TDepartment, TGender } from 'src/types';

export type CastDocument = Cast & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Cast {
  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  gender?: TGender;

  @ApiProperty()
  @Prop({ required: true })
  lastPopularity: number;

  @ApiProperty()
  @Prop()
  profileImage: string | null;

  @ApiProperty()
  @Prop()
  departmentWorked: TDepartment;

  @ApiProperty()
  @Prop()
  order: number;

  @ApiProperty()
  @Prop()
  character: string;

  @Prop()
  tmdbId: string | null;

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  movieId: ObjectId;

  @ApiProperty()
  @Prop({ type: Types.ObjectId })
  tvShowId: ObjectId;

  @ApiProperty({ required: true, type: Types.ObjectId })
  peopleId: ObjectId;
}

export const CastSchema = SchemaFactory.createForClass(Cast);
