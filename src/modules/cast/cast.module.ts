import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cast, CastSchema } from 'src/schemas/cast.schema';
import { PersonModule } from '../person/person.module';
import { TheMovieDbModule } from '../the-movie-db/the-movie-db.module';
import { CastService } from './cast.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cast.name, schema: CastSchema }]),
    TheMovieDbModule,
    PersonModule,
  ],
  controllers: [],
  exports: [CastService],
  providers: [CastService],
})
export class CastModule {}
