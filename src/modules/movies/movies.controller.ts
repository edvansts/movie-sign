import {
  Body,
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
  ApiOkResponse,
} from '@nestjs/swagger';
import { CustomCacheInterceptor } from 'src/config/interceptors/custom-cache-interceptor';
import { Cast } from 'src/schemas/cast.schema';
import { Movie } from 'src/schemas/movie.schema';
import { Rating } from 'src/schemas/rating.schema';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RatingBody } from '../rating/rating.validator';
import { MoviesService } from './movies.service';
import { SearchByNameQueryParams } from './movies.validator';

@ApiBearerAuth('Bearer')
@ApiTags('movies')
@Controller('movies')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCacheInterceptor)
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService, // private readonly mailService: MailService,
  ) {}

  @ApiOperation({ summary: 'Get this week trending movies;' })
  @ApiResponse({ status: 200, type: [Movie] })
  @Get('trending')
  @CacheTTL(60 * 30)
  async getTrendingMovies() {
    return await this.moviesService.getTrendingMovies();
  }

  @ApiOperation({ summary: 'Get this week movies in theatres;' })
  @ApiResponse({ status: 200, type: [Movie] })
  @Get('in-theatres')
  @CacheTTL(60 * 30)
  async getMoviesInTheatres() {
    return await this.moviesService.getMoviesInTheatres();
  }

  @ApiOperation({ summary: 'Get this week top rated movies;' })
  @ApiResponse({ status: 200, type: [Movie] })
  @Get('top-rated')
  @CacheTTL(60 * 30)
  async getTopRatedMovies() {
    return await this.moviesService.getTopRated();
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

  // @NoCache()
  // @Get('mail')
  // @HttpCode(204)
  // async getEmail(): Promise<void> {
  //   try {
  //     await this.mailService.sendToEdvan();
  //   } catch (err) {
  //     throw new InternalServerErrorException(err);
  //   }
  // }

  @Get(':movieId')
  @ApiOperation({ summary: 'Get movie by id' })
  @ApiOkResponse()
  async getMovieById(@Param('movieId') movieId: string) {
    return await this.moviesService.getMovieById(movieId);
  }
}
