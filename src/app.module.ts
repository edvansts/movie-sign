import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { ClientOpts } from 'redis';

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
    CacheModule.register<ClientOpts>({
      store: redisStore as any,

      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      ttl: 60 * 3,

      isGlobal: true,
    }),
    MoviesModule,
    AuthModule,
    TvShowsModule,
    AllModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
