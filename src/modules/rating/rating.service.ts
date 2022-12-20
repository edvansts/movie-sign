import { ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
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

  async rateMovie(movieId: ObjectId, ratingBody: RatingBody) {
    const userId = new Types.ObjectId(this.request.user.id);

    const userHasRatingCreated = await this.ratingModel.exists({
      movieId,
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
        castId: cast._id,
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
