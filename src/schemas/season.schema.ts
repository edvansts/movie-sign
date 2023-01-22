import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types } from 'mongoose';

export type SeasonDocument = Season & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  _id: false,
  autoIndex: false,
})
export class Episode {
  @ApiProperty({ type: Number })
  @Prop({ required: true })
  episodeNumber: number;

  @ApiProperty({ type: Number })
  @Prop({ required: true, type: Number })
  tmdbId: number;

  @ApiProperty({ type: String })
  @Prop({ required: true, type: Number })
  name: string;

  @ApiProperty({ type: String })
  @Prop({ required: false, type: String })
  overview?: string;

  @ApiProperty({ type: Number })
  @Prop({ type: Number, required: false })
  lastRating?: number;

  @ApiProperty({ type: Date })
  @Prop({ type: Date })
  airDate?: Date;

  @ApiProperty({ type: String })
  @Prop({ type: String || null })
  posterImage?: string | null;
}

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Season {
  @ApiProperty({ type: String })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ type: Number })
  @Prop({ unique: true })
  tmdbId: number;

  @ApiProperty({ type: Date || undefined })
  @Prop()
  airDate: Date;

  @ApiProperty({ type: String || undefined })
  @Prop()
  overview: string;

  @ApiProperty({ type: String || undefined })
  @Prop()
  posterImage: string;

  @ApiProperty({ type: Number })
  @Prop()
  seasonNumber: number;

  @ApiProperty({ type: Types.ArraySubdocument })
  @Prop({ type: Types.ArraySubdocument })
  episodes: Episode[];

  @ApiProperty({ required: true, type: Types.ObjectId })
  @Prop({ required: true, type: Types.ObjectId })
  tvShowId: ObjectId;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
