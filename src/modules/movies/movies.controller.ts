import {
  Controller,
  Get,
  Header,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { defaultCache } from 'src/constants';
import { Cast } from 'src/schemas/cast.schema';
import { Movie } from 'src/schemas/movie.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MoviesService } from './movies.service';
import { SearchByNameQueryParams } from './movies.validator';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get this week trending movies;' })
  @ApiResponse({ status: 200, type: [Movie] })
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

  @Get(':movieId/cast')
  @ApiOperation({ summary: 'Get casts of a movie' })
  @ApiResponse({ status: 200, type: [Cast] })
  @Header('Cache-Control', defaultCache)
  async getMovieCast(@Param('movieId') movieId: string) {
    return await this.moviesService.getMovieCast(movieId);
  }

  @Get(':movieId')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiResponse({ status: 200, type: Movie })
  @Header('Cache-Control', defaultCache)
  async getMovieById(@Param('movieId') movieId: string) {
    return await this.moviesService.getMovieById(movieId);
  }
}
