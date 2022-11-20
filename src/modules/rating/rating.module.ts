import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rating, RatingSchema } from 'src/schemas/rating.schema';
import { RatingService } from './rating.service';
import { CastModule } from '../cast/cast.module';

@Module({
  providers: [RatingService],
  imports: [
    MongooseModule.forFeature([{ name: Rating.name, schema: RatingSchema }]),
    CastModule,
  ],
  exports: [RatingService],
})
export class RatingModule {}
