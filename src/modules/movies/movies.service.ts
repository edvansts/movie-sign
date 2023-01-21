import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { Trending, TrendingDocument } from 'src/schemas/trending.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import { startOfWeek, endOfWeek, differenceInMonths } from 'date-fns';
import { SearchByNameQueryParams } from './movies.validator';
import { numberSortByKey } from 'src/helpers/array';
import {
  SearchQueries,
  SearchQueriesDocument,
} from 'src/schemas/search-queries.schema';
import { MEDIA_TYPE } from 'src/types';
import { getImageUrl } from 'src/helpers';
import { CastService } from '../cast/cast.service';
import { RatingService } from '../rating/rating.service';
import { RatingBody } from '../rating/rating.validator';
import { REQUEST } from '@nestjs/core';
import type { RequestWithUser } from 'src/types/services';
import { IMovieWithRating } from './types';
import { isNotEmptyObject } from 'class-validator';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Trending.name) private trendingModel: Model<TrendingDocument>,
    @InjectModel(SearchQueries.name)
    private searchedQueriesModel: Model<SearchQueriesDocument>,
    private readonly theMovieDbService: TheMovieDbService,
    private readonly castService: CastService,
    private readonly ratingService: RatingService,
    @Inject(REQUEST) private request: RequestWithUser,
  ) {}

  async getTrendingMovies() {
    try {
      const today = new Date();
      const weekTrending = await this.trendingModel.findOne({
        type: MEDIA_TYPE.movie,
        startedAt: {
          $lt: today,
        },
        endedAt: {
          $gt: today,
        },
      });

      if (weekTrending) {
        const list = await this.movieModel
          .find({
            _id: {
              $in: weekTrending.list,
            },
          })
          .sort({ lastPopularity: 'desc' });

        return list;
      }

      const { results: movies } =
        await this.theMovieDbService.getTrendingMovies();

      const moviesList = (
        await Promise.all(
          movies.map(async (movie) => {
            const { id } = movie;

            try {
              if (!id) {
                return null;
              }

              return await this.getMovieByTmdbId(id);
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((movie) => !!movie);

      const sortedList = numberSortByKey('lastPopularity', moviesList, 'desc');

      this.trendingModel.create({
        startedAt: startOfWeek(today),
        endedAt: endOfWeek(today),
        type: MEDIA_TYPE.movie,
        list: sortedList.map(({ _id }) => _id),
      });

      return sortedList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  async getMovieByTmdbId(tmdbId: number | string) {
    const dbMovie = await this.movieModel.findOne({
      tmdbId,
    });

    if (dbMovie) {
      if (differenceInMonths(dbMovie.updatedAt, new Date()) >= 1) {
        await this.updateMovieInfo(dbMovie);
      }

      return dbMovie;
    }

    const {
      title,
      originalTitle,
      voteAverage,
      releaseDate,
      popularity,
      posterPath,
      imdbId,
      id: newTmdbId,
      overview,
      backdropPath,
      adult,
      runtime,
    } = await this.theMovieDbService.getMovieById(tmdbId);

    const newMovieModel = new this.movieModel({
      title: title || originalTitle,
      lastRating: voteAverage,
      releaseDate: new Date(releaseDate),
      lastPopularity: popularity,
      imdbId,
      tmdbId: newTmdbId,
      posterImage: posterPath ?? getImageUrl(posterPath),
      backdropImage: backdropPath ?? getImageUrl(backdropPath),
      overview: overview || '',
      originalTitle: originalTitle || '',
      adult,
      runtime,
    });

    const createdMovie = await this.movieModel.create(newMovieModel);

    return createdMovie;
  }

  async searchMoviesByQuery({ limit = 20, query }: SearchByNameQueryParams) {
    const searchQuery = query.split(' ').reduce((prev, cur, i) => {
      if (i == 0) {
        return `\"${cur}\"`;
      }

      return `${prev} \"${cur}\"`;
    }, '');

    const findedMovies: MovieDocument[] = await this.movieModel.aggregate([
      {
        $match: {
          $text: {
            $search: searchQuery,
          },
        },
      },
      { $sort: { lastPopularity: -1 } },
      { $limit: limit },
    ]);

    const isQuerySearchedEarly = await this.searchedQueriesModel.findOne({
      query,
    });

    if (!!isQuerySearchedEarly) {
      return findedMovies;
    }

    const { results: externalSearchedMovies } =
      await this.theMovieDbService.searchMovie(query);

    const externalSearchedMoviesNormalized = numberSortByKey<
      typeof externalSearchedMovies
    >('popularity', externalSearchedMovies, 'desc').filter(
      (movie) =>
        !findedMovies.map(({ tmdbId }) => tmdbId).includes(String(movie.id)),
    );

    const extraMovies = (
      await Promise.all(
        externalSearchedMoviesNormalized.map(async (movie) => {
          const { id } = movie;

          try {
            if (!id) {
              return null;
            }

            return await this.getMovieByTmdbId(id);
          } catch (err) {
            return null;
          }
        }),
      )
    ).filter((movie) => !!movie);

    const allSearchedMovies = numberSortByKey<MovieDocument[]>(
      'popularity',
      [...findedMovies, ...extraMovies],
      'desc',
    ).slice(0, limit);

    this.searchedQueriesModel.create({
      query,
    });

    return allSearchedMovies;
  }

  async getMovieCast(movieId: string) {
    try {
      const movie = await this.movieModel.findById(movieId);

      if (!movie) {
        throw new NotFoundException('Filme não encontrado');
      }

      const movieCast = await this.castService.getCastByMovie(movie);

      return movieCast;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMovieById(movieId: string) {
    const userId = new Types.ObjectId(this.request.user.id);
    const movieObjectId = new Types.ObjectId(movieId);

    const [movie] = await this.movieModel.aggregate<IMovieWithRating>([
      { $match: { _id: movieObjectId } },
      {
        $lookup: {
          from: 'ratings',
          pipeline: [{ $match: { movieId: movieObjectId, userId } }],
          as: 'rating',
        },
      },
      {
        $unwind: { path: '$rating', preserveNullAndEmptyArrays: true },
      },
    ]);

    if (!isNotEmptyObject(movie)) {
      throw new NotFoundException('Filme não encontrado');
    }

    return movie;
  }

  async getMovieId(movieId: string) {
    const movie = await this.movieModel.findById(movieId, { _id: 1 });

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    return movie;
  }

  async updateMovieInfo(movie: MovieDocument) {
    try {
      const {
        voteAverage,
        popularity,
        runtime,
        genres = [],
      } = await this.theMovieDbService.getMovieById(movie.tmdbId);

      movie.lastPopularity = popularity;
      movie.lastRating = voteAverage;
      movie.runtime = runtime;
      movie.genres = genres.map((genre) => genre.name);

      await movie.save();
    } catch {}
  }

  async rate(movieId: string, ratingBody: RatingBody) {
    const movie = await this.getMovieId(movieId);

    return await this.ratingService.rateMovie(movie._id, ratingBody);
  }

  async getTopRated() {
    try {
      const { results: movies } =
        await this.theMovieDbService.getTopRatedMovies();

      const moviesList = (
        await Promise.all(
          movies.map(async (movie) => {
            const { id } = movie;

            try {
              if (!id) {
                return null;
              }

              return await this.getMovieByTmdbId(id);
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((movie) => !!movie);

      return moviesList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMoviesInTheatres() {
    try {
      const { results: movies } =
        await this.theMovieDbService.getMoviesInTheatres();

      const moviesList = (
        await Promise.all(
          movies.map(async (movie) => {
            const { id } = movie;

            try {
              if (!id) {
                return null;
              }

              return await this.getMovieByTmdbId(id);
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((movie) => !!movie);

      return moviesList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
