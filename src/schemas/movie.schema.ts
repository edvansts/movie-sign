import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MovieDocument = Movie & Document;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  lastRating: number;

  @Prop({ required: true })
  overview: string;

  @Prop({ required: true })
  popularity: number;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop()
  posterImage: string;

  @Prop()
  externalId: string;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
