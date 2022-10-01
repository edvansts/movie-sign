import { Controller, Get, Header, Query, UseGuards } from '@nestjs/common';
import { defaultCache } from 'src/constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoviesService } from './movies.service';
import { SearchByNameQueryParams } from './movies.validator';

@Controller('movies')
@UseGuards(JwtAuthGuard)
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
