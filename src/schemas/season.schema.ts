import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId, Types } from 'mongoose';

export type SeasonDocument = Season & Document;

export class Episode {
  constructor(
    public episodeNumber: number,
    public tmdbId: number,
    public name: string,
    public overview?: string,
    public lastRating?: number,
    public airDate?: Date,
    public posterImage?: string | null,
  ) {}
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

  @ApiProperty({ type: Episode })
  episodes: Episode[];

  @ApiProperty({ required: true, type: Types.ObjectId })
  @Prop({ required: true, type: Types.ObjectId })
  tvShowId: ObjectId;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
