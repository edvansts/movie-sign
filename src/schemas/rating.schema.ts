import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types } from 'mongoose';

export type RatingDocument = Rating & Document;

export class FavoritePerson {
  castId: ObjectId;
  castName: string;
  castImage: string;

  personId: ObjectId;
  personName: string;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Rating {
  @ApiProperty()
  @Prop()
  id: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId })
  userId: ObjectId;

  @ApiProperty({ minimum: 0, maximum: 5 })
  @Prop({ required: true })
  grade: number;

  @Prop({ type: FavoritePerson })
  @ApiProperty({ type: FavoritePerson })
  favoritePerformance: FavoritePerson;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId })
  movieId: ObjectId;

  @ApiProperty({ type: String })
  @Prop({ type: Types.ObjectId })
  tvShow: ObjectId;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
