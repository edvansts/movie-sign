import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MovieDocument } from 'src/schemas/movie.schema';
import { Rating, RatingDocument } from 'src/schemas/rating.schema';
import { RequestWithUser } from 'src/types/services';
import { CastService } from '../cast/cast.service';
import { RatingBody } from './rating.validator';

@Injectable({ scope: Scope.REQUEST })
export class RatingService {
  constructor(
    @InjectModel(Rating.name)
    private readonly ratingModel: Model<RatingDocument>,
    @Inject(REQUEST) private request: RequestWithUser,
    private readonly castService: CastService,
  ) {}

  async rateMovie(movie: MovieDocument, ratingBody: RatingBody) {
    const userId = this.request.user.id;
    const movieId = movie.id;

    const userHasRatingCreated = this.ratingModel.exists({
      movieId: movie.id,
      userId,
    });

    if (userHasRatingCreated) {
      throw new ConflictException(
        'Já existe uma avaliação criada para esse filme.',
      );
    }

    const { favoritePerformance, grade } = ratingBody;

    const cast = await this.castService.getCastById(favoritePerformance);

    const newRating = new this.ratingModel({
      userId,
      movieId,
      grade,
      favoritePerformance: {
        castId: cast.id,
        castImage: cast.profileImage,
        castName: cast.character,

        personId: cast.personId,
        personName: cast.name,
      },
    });

    await newRating.save();

    return newRating;
  }
}
