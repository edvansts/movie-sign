import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from 'src/schemas/cast.schema';
import { Movie, MovieSchema } from 'src/schemas/movie.schema';
import {
  SearchQueries,
  SearchQueriesSchema,
} from 'src/schemas/searched-queries.schema';
import { Trending, TrendingSchema } from 'src/schemas/trending.schema';
import { TheMovieDbModule } from '../the-movie-db/the-movie-db.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Movie.name, schema: MovieSchema },
      { name: Trending.name, schema: TrendingSchema },
      { name: SearchQueries.name, schema: SearchQueriesSchema },
      { name: Cast.name, schema: CastSchema },
    ]),
    TheMovieDbModule,
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
