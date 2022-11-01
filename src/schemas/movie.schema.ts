import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Movie {
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
  @Prop({ required: true })
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
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
