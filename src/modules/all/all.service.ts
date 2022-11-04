import { Injectable } from '@nestjs/common';
import { SearchResultDocument } from 'src/schemas/search-result.schema';
import { SEARCH_TYPES } from 'src/types';
import { MoviesService } from '../movies/movies.service';
import { SearchService } from '../search/search.service';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import { TvShowsService } from '../tv-shows/tv-shows.service';
import { SearchAllQueryParams } from './all.validator';

@Injectable()
export class AllService {
  constructor(
    private readonly theMovieDbService: TheMovieDbService,
    private readonly searchService: SearchService,
    private readonly moviesService: MoviesService,
    private readonly tvShowsService: TvShowsService,
  ) {}

  async searchAll(params: SearchAllQueryParams) {
    const search = this.searchService.findSearchResult(params.query);

    if (search) {
      return await this.getDataFromSearchResult(search);
    }

    const searchResult = await this.theMovieDbService.multiSearch(params.query);

    return searchResult;
  }

  private async getDataFromSearchResult(
    searchResult: SearchResultDocument,
    params: SearchAllQueryParams,
  ) {
    const response = {
      page: params.page,
      totalPages: searchResult.totalPages,
      totalResults: searchResult.totalResults,
      results: [],
    };

    Promise.all(
      searchResult.results.map(async (result) => {
        switch (result.type) {
          case SEARCH_TYPES.movie:
            const movie = await this.moviesService.getMovieByTmdbId(
              result.tmdbId,
            );
            response.results.push(movie);
            break;
          case SEARCH_TYPES.tv:
            const tvShow = await this.tvShowsService.getTvShowByTmdbId(
              result.tmdbId,
            );
            response.results.push(tvShow);
            break;
          case SEARCH_TYPES.people:
            const people = await this.moviesService.getMovieByTmdbId(
              result.tmdbId,
            );
            response.results.push(movie);
            break;
        }
      }),
    );
  }
}
