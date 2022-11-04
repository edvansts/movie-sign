import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SEARCH_TYPES } from 'src/types';

type IResult = {
  type: SEARCH_TYPES;
  tmdbId: number;
  knownFor?: { type: SEARCH_TYPES.movie | SEARCH_TYPES.tv; tmdbId: number };
};

@Schema({ versionKey: false })
class SearchResult {
  @Prop({ required: true })
  startedAt: Date;

  @Prop({ required: true })
  endedAt: Date;

  @Prop({ required: true })
  results: IResult[];

  @Prop()
  totalPages: number;

  @Prop()
  totalResults: number;

  @Prop()
  query: string;
}

const SearchResultSchema = SchemaFactory.createForClass(SearchResult);

export type SearchResultDocument = SearchResult & Document;
export { SearchResultSchema, SearchResult };
