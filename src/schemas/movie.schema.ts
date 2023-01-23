import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Types } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Movie {
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;

  @ApiProperty()
  @Prop({ required: true })
  title: string;

  @ApiProperty()
  @Prop()
  originalTitle: string;

  @ApiProperty()
  @Prop({ required: true })
  lastRating: number;

  @ApiProperty()
  @Prop({ type: String })
  overview: string;

  @ApiProperty()
  @Prop({ required: true })
  lastPopularity: number;

  @ApiProperty()
  @Prop({ required: true })
  releaseDate: Date;

  @ApiProperty()
  @Prop()
  posterImage?: string;

  @ApiProperty()
  @Prop()
  backdropImage?: string;

  @Prop()
  tmdbId?: string;

  @Prop()
  imdbId?: string;

  @ApiProperty()
  @Prop()
  adult?: boolean;

  @ApiProperty({ type: Number || null })
  @Prop({ type: Number || null })
  runtime: number | null;

  @ApiProperty({ type: Types.Array<string>, default: [] })
  @Prop({ type: Array<string>, default: [] })
  genres: string[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
