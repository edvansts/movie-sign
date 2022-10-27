import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Season, SeasonSchema } from 'src/schemas/season.schema';
import { TheMovieDbModule } from '../the-movie-db/the-movie-db.module';
import { SeasonService } from './season.service';

@Module({
  imports: [
    TheMovieDbModule,
    MongooseModule.forFeature([{ name: Season.name, schema: SeasonSchema }]),
  ],
  providers: [SeasonService],
  exports: [SeasonService],
})
export class SeasonModule {}
