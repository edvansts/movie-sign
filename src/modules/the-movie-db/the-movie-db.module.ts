import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TheMovieDbService } from './the-movie-db.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: 'https://api.themoviedb.org/3/',
        params: { api_key: configService.get('THE_MOVIE_DB_API_KEY') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TheMovieDbService],
  exports: [TheMovieDbService],
})
export class TheMovieDbModule {}
