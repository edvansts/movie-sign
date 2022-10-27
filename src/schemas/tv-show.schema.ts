import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TvShowDocument = TvShow & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TvShow {
  @Prop({ required: true })
  name: string;

  @Prop()
  originalName: string;

  @Prop({ required: true })
  lastRating: number;

  @Prop({ required: true })
  overview: string;

  @Prop({ required: true })
  lastPopularity: number;

  @Prop({ required: true })
  firstAirDate: Date;

  @Prop({ required: true })
  lastAirDate: Date;

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

  @Prop()
  createdBy?: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];

  @Prop()
  genres?: {
    id: number;
    name: string;
  }[];

  @Prop()
  homepage?: string;

  @Prop()
  inProduction: boolean;

  @Prop({ type: 'object' })
  lastEpisodeToAir?: {
    airDate: string;
    episodeNumber: number;
    id: number;
    name: string;
    overview: string;
    seasonNumber: number;
    voteAverage: number;
  };

  @Prop({ type: 'object' })
  nextEpisodeToAir?: {
    airDate: string;
    episodeNumber: number;
    id: number;
    name: string;
    overview: string;
    seasonNumber: number;
    voteAverage: number;
  };

  @Prop()
  numberOfEpisodes?: number;

  @Prop()
  numberOfSeasons?: number;

  @Prop()
  tagline?: string;

  @Prop()
  productionCompanies?: {
    name: string;
    id: number;
    logoPath: string | null;
    originCountry: string;
  }[];

  @Prop()
  status?: string;
}

export const TvShowSchema = SchemaFactory.createForClass(TvShow);
