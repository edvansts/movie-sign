import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop()
  originalTitle: string;

  @Prop({ required: true })
  lastRating: number;

  @Prop({ required: true })
  overview: string;

  @Prop({ required: true })
  lastPopularity: number;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop()
  posterImage?: string;

  @Prop()
  backdropImage?: string;

  @Prop()
  tmdbId?: string;

  @Prop()
  imdbId?: string;

  @Prop()
  adult?: boolean;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
