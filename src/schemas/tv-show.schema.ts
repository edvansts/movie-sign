import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TvShowDocument = TvShow & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TvShow {
  @Prop()
  createdAt?: Date;

  @ApiProperty()
  @Prop()
  updatedAt?: Date;

  @ApiProperty()
  @Prop({ required: true })
  name: string;

  @ApiProperty()
  @Prop()
  originalName: string;

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
  firstAirDate: Date;

  @ApiProperty()
  @Prop({ required: true })
  lastAirDate: Date;

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

  @ApiProperty()
  @Prop()
  createdBy?: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];

  @ApiProperty()
  @Prop()
  genres?: {
    id: number;
    name: string;
  }[];

  @ApiProperty()
  @Prop()
  @ApiProperty()
  homepage?: string;

  @Prop()
  inProduction: boolean;

  @ApiProperty()
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

  @ApiProperty()
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

  @ApiProperty()
  @Prop()
  numberOfEpisodes?: number;

  @ApiProperty()
  @Prop()
  numberOfSeasons?: number;

  @ApiProperty()
  @Prop()
  tagline?: string;

  @ApiProperty()
  @Prop()
  productionCompanies?: {
    name: string;
    id: number;
    logoPath: string | null;
    originCountry: string;
  }[];

  @ApiProperty()
  @Prop()
  status?: string;
}

export const TvShowSchema = SchemaFactory.createForClass(TvShow);
