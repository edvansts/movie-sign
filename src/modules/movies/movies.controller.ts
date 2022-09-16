import { Controller, Get, Header, Query } from '@nestjs/common';
import { defaultCache } from 'src/constants';
import { MoviesService } from './movies.service';
import { SearchByNameQueryParams } from './movies.validator';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('trending')
  @Header('Cache-Control', defaultCache)
  async getTrendingMovies() {
    return await this.moviesService.getTrendingMovies();
  }

  @Get('search')
  @Header('Cache-Control', defaultCache)
  async searchByName(@Query() params: SearchByNameQueryParams) {
    return await this.moviesService.searchMoviesByQuery(params);
  }
}
