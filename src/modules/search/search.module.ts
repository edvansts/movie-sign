import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SearchResult,
  SearchResultSchema,
} from 'src/schemas/search-result.schema';
import { SearchService } from './search.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SearchResult.name, schema: SearchResultSchema },
    ]),
  ],
  controllers: [],
  exports: [SearchService],
  providers: [SearchService],
})
export class SearchModule {}
