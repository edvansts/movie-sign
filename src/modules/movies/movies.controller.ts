import {
  Body,
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { Cast } from 'src/schemas/cast.schema';
import { Movie } from 'src/schemas/movie.schema';
import { Rating } from 'src/schemas/rating.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RatingBody } from '../rating/rating.validator';
import { MoviesService } from './movies.service';
import { SearchByNameQueryParams } from './movies.validator';

@ApiBearerAuth()
@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Get this week trending movies;' })
  @ApiResponse({ status: 200, type: [Movie] })
  @Get('trending')
  @CacheTTL(60 * 30)
  async getTrendingMovies() {
    return await this.moviesService.getTrendingMovies();
  }

  @Get('search')
  async searchByName(@Query() params: SearchByNameQueryParams) {
    return await this.moviesService.searchMoviesByQuery(params);
  }

  @Get(':movieId/cast')
  @ApiOperation({ summary: 'Get casts of a movie' })
  @ApiResponse({ status: 200, type: [Cast] })
  async getMovieCast(@Param('movieId') movieId: string) {
    return await this.moviesService.getMovieCast(movieId);
  }

  @Post(':movieId/rate')
  @ApiOperation({ summary: 'Rate a movie' })
  @ApiResponse({ status: 200, type: Rating })
  async rateMovie(
    @Param('movieId') movieId: string,
    @Body() ratingBody: RatingBody,
  ) {
    return await this.moviesService.rate(movieId, ratingBody);
  }

  @Get(':movieId')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiResponse({ status: 200, type: Movie })
  async getMovieById(@Param('movieId') movieId: string) {
    return await this.moviesService.getMovieById(movieId);
  }
}
