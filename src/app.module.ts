import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { MoviesModule } from './modules/movies/movies.module';
import { validate } from './config/env';
import { AuthModule } from './modules/auth/auth.module';
import { TvShowsModule } from './modules/tv-shows/tv-shows.module';
import { AllModule } from './modules/all/all.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    MoviesModule,
    AuthModule,
    TvShowsModule,
    AllModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
