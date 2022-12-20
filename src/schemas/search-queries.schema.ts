import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SearchQueriesDocument = SearchQueries & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class SearchQueries {
  @Prop({ required: true })
  query: string;

  @Prop({ type: Date, expires: '12 w' })
  createdAt?: Date;
}

export const SearchQueriesSchema = SchemaFactory.createForClass(SearchQueries);
