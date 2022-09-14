import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { TMediaTypes } from 'src/types';
import { DtoMovie, DtoTrending, TTimeWindow } from './types';

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
}
