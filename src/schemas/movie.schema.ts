import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
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
  posterImage: string | null;

  @Prop()
  tmdbId: string | null;

  @Prop()
  imdbId: string | null;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
