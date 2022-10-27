import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trending, TrendingSchema } from 'src/schemas/trending.schema';
import { TvShow, TvShowSchema } from 'src/schemas/tv-show.schema';
import { SeasonModule } from '../season/season.module';
import { TheMovieDbModule } from '../the-movie-db/the-movie-db.module';
import { TvShowsController } from './tv-shows.controller';
import { TvShowsService } from './tv-shows.service';

@Module({
  imports: [
    TheMovieDbModule,
    SeasonModule,
    MongooseModule.forFeature([
      { name: Trending.name, schema: TrendingSchema },
      { name: TvShow.name, schema: TvShowSchema },
    ]),
  ],
  controllers: [TvShowsController],
  providers: [TvShowsService],
})
export class TvShowsModule {}
