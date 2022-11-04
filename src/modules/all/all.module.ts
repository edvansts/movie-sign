import { Module } from '@nestjs/common';
import { MoviesModule } from '../movies/movies.module';
import { SearchModule } from '../search/search.module';
import { TheMovieDbModule } from '../the-movie-db/the-movie-db.module';
import { TvShowsModule } from '../tv-shows/tv-shows.module';
import { AllController } from './all.controller';
import { AllService } from './all.service';

@Module({
  imports: [TheMovieDbModule, SearchModule, MoviesModule, TvShowsModule],
  controllers: [AllController],
  providers: [AllService],
})
export class AllModule {}
