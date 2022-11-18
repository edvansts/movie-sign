import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { MEDIA_TYPE } from 'src/types';
import {
  DtoMovie,
  DtoMovieCredits,
  DtoMultiSearch,
  DtoSearchMovie,
  DtoSeason,
  DtoTrending,
  DtoTvShow,
  MinimalMovie,
  MinimalTvShow,
  TTimeWindow,
} from './types';

@Injectable()
export class TheMovieDbService {
  constructor(private readonly httpService: HttpService) {}

  private async getTrending<T>(
    mediaType: MEDIA_TYPE = MEDIA_TYPE.all,
    timeWindow: TTimeWindow = 'week',
  ) {
    try {
      const response = await this.httpService.axiosRef.get<DtoTrending<T>>(
        `/trending/${mediaType}/${timeWindow}`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTrendingMovies(timeWindow: TTimeWindow = 'week') {
    return await this.getTrending<MinimalMovie>(MEDIA_TYPE.movie, timeWindow);
  }

  async getTrendingTvShows(timeWindow: TTimeWindow = 'week') {
    return await this.getTrending<MinimalTvShow>(MEDIA_TYPE.tv, timeWindow);
  }

  async getMovieById(id: number | string) {
    try {
      const response = await this.httpService.axiosRef.get<DtoMovie>(
        `/movie/${id}`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getTvShowById(id: number | string) {
    try {
      const response = await this.httpService.axiosRef.get<DtoTvShow>(
        `/tv/${id}`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async searchMovie(query: string) {
    try {
      const response = await this.httpService.axiosRef.get<DtoSearchMovie>(
        `/search/movie`,
        { params: { query } },
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMovieCredits(movieId: string) {
    try {
      const response = await this.httpService.axiosRef.get<DtoMovieCredits>(
        `/movie/${movieId}/credits`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSeasonByTvShowId(tvShowId: string | number, seasonNumber: number) {
    try {
      const response = await this.httpService.axiosRef.get<DtoSeason>(
        `/tv/${tvShowId}/season/${seasonNumber}`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async multiSearch(query: string, page?: number) {
    try {
      const response = await this.httpService.axiosRef.get<DtoMultiSearch>(
        `/search/multi`,
        { params: { query, page } },
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
