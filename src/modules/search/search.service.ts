import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import addWeeks from 'date-fns/addWeeks';
import { Model } from 'mongoose';
import {
  SearchResult,
  SearchResultDocument,
} from 'src/schemas/search-result.schema';
import { SEARCH_TYPES } from 'src/types';
import { AllSearchResult } from './types';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(SearchResult.name)
    private readonly searchResultModel: Model<SearchResultDocument>,
  ) {}

  async createMultiSearch(data: AllSearchResult) {
    try {
      const { results, total_pages, total_results } = data;

      const newSearchResult = new this.searchResultModel({
        totalPages: total_pages,
        totalResults: total_results,
        startedAt: new Date(),
        endedAt: addWeeks(new Date(), 1),
        results: [],
      });

      results.forEach((result) => {
        switch (result.media_type) {
          case SEARCH_TYPES.movie:
            newSearchResult.results.push({
              tmdbId: result.id,
              type: result.media_type,
            });
            return;
          case SEARCH_TYPES.tv:
            newSearchResult.results.push({
              tmdbId: result.id,
              type: result.media_type,
            });
            return;
          case SEARCH_TYPES.people:
            newSearchResult.results.push({
              tmdbId: result.id,
              type: result.media_type,
              knownFor: {
                tmdbId: result.known_for.id,
                type: result.known_for.media_type,
              },
            });
        }

        newSearchResult;
      });

      await newSearchResult.save();
    } catch {}
  }

  async findSearchResult(query: string) {
    const today = new Date();
    const searchResult = await this.searchResultModel.findOne({
      startedAt: {
        $lt: today,
      },
      endedAt: {
        $gt: today,
      },
      query,
    });

    return searchResult || null;
  }
}
