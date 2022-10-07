import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TMediaTypes } from 'src/types';
import {
  DtoMovie,
  DtoMovieCredits,
  DtoSearchMovie,
  DtoTrending,
  TTimeWindow,
} from './types';

@Injectable()
export class TheMovieDbService {
  constructor(private readonly httpService: HttpService) {}

  async getTrending(
    mediaType: TMediaTypes = 'all',
    timeWindow: TTimeWindow = 'week',
  ) {
    try {
      const response = await this.httpService.axiosRef.get<DtoTrending>(
        `/trending/${mediaType}/${timeWindow}`,
      );

      return response.data;
    } catch (error) {
      throw new Error(error);
    }
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
      console.log('po');
      const response = await this.httpService.axiosRef.get<DtoMovieCredits>(
        `/movie/${movieId}/credits`,
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
