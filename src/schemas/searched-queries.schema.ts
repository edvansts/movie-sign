import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SearchQueriesDocument = SearchQueries & Document;

@Schema()
export class SearchQueries {
  @Prop({ required: true })
  query: string;
}

export const SearchQueriesSchema = SchemaFactory.createForClass(SearchQueries);
