import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';

export type SeasonDocument = Season & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Season {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true })
  tmdbId: number;

  @Prop()
  airDate: Date;

  @Prop()
  overview: string;

  @Prop()
  posterImage: string;

  @Prop()
  seasonNumber: number;

  @Prop()
  episodes: IEpisode[];

  @Prop({ required: true, type: Types.ObjectId })
  tvShowId: ObjectId;
}

export interface IEpisode {
  airDate?: Date;
  episodeNumber: number;
  tmdbId: number;
  name: string;
  overview?: string;
  lastRating?: number;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
