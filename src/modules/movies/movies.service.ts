import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { Trending, TrendingDocument } from 'src/schemas/trending.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import { startOfWeek, endOfWeek } from 'date-fns';
import { SearchByNameQueryParams } from './movies.validator';
import { numberSortByKey } from 'src/helpers/array';
import {
  SearchQueries,
  SearchQueriesDocument,
} from 'src/schemas/searched-queries.schema';
import { Cast, CastDocument } from 'src/schemas/cast.schema';
import { TDepartmentWorked } from 'src/types';
import { getImageUrl, normalizeGender } from 'src/helpers';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Trending.name) private trendingModel: Model<TrendingDocument>,
    @InjectModel(Cast.name) private castModel: Model<CastDocument>,
    @InjectModel(SearchQueries.name)
    private searchedQueriesModel: Model<SearchQueriesDocument>,
    private readonly theMovieDbService: TheMovieDbService,
  ) {}

  async getTrendingMovies() {
    try {
      const today = new Date();
      const weekTrending = await this.trendingModel.findOne({
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

      const { results: movies } = await this.theMovieDbService.getTrending(
        'movie',
        'week',
      );

      const moviesList = (
        await Promise.all(
          movies.map(async (movie) => {
            const { id, popularity, vote_average } = movie;

            try {
              if (!id) {
                return null;
              }

              return await this.getMovieByTmdbId(id, {
                popularity: popularity,
                rating: vote_average,
              });
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((movie) => !!movie);

      const sortedList = numberSortByKey(
        'lastPopularity',
        moviesList,
        'desc',
      ).map(({ _id }) => _id);

      this.trendingModel.create({
        startedAt: startOfWeek(today),
        endedAt: endOfWeek(today),
        type: 'movie',
        list: sortedList,
      });

      return sortedList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  private async getMovieByTmdbId(
    tmdbId: number | string,
    additionalData?: { popularity: number; rating: number },
  ) {
    const dbMovie = await this.movieModel.findOne({
      tmdbId: tmdbId,
    });

    if (dbMovie) {
      if (additionalData) {
        dbMovie.update({
          $set: {
            lastPopularity: additionalData.popularity,
            lastRating: additionalData.rating,
          },
        });
      }

      return dbMovie;
    }

    const {
      title,
      original_title,
      vote_average,
      release_date,
      popularity,
      poster_path,
      imdb_id,
      id: newTmdbId,
      overview,
    } = await this.theMovieDbService.getMovieById(tmdbId);

    const newMovieModel = new this.movieModel({
      title: title || original_title,
      lastRating: vote_average,
      releaseDate: new Date(release_date),
      lastPopularity: popularity,
      imdbId: imdb_id,
      tmdbId: newTmdbId,
      posterImage: poster_path ? getImageUrl(poster_path) : null,
      overview: overview || '',
      originalTitle: original_title || '',
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
          const { id, popularity, vote_average } = movie;

          try {
            if (!id) {
              return null;
            }

            return await this.getMovieByTmdbId(id, {
              popularity: popularity,
              rating: vote_average,
            });
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
    const movie = await this.movieModel.findById(movieId);

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    try {
      const movieCasts = await this.getCastsByMovieId(movie.id);

      if (movieCasts.length > 0) {
        return movieCasts;
      }

      const { cast } = await this.theMovieDbService.getMovieCredits(
        movie.tmdbId,
      );

      console.log(cast);

      const newCasts = cast.map((people) => {
        const {
          name,
          popularity,
          gender,
          id,
          character,
          known_for_department,
          order,
          profile_path,
        } = people;

        return new this.castModel({
          name,
          lastPopularity: popularity,
          order,
          character,
          tmdbId: id,
          departmentWorked: known_for_department as TDepartmentWorked,
          gender: normalizeGender(gender),
          profileImage: getImageUrl(profile_path),
          movieId: movie.id,
        });
      });

      this.castModel.insertMany(newCasts);

      return newCasts;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getCastsByMovieId(movieId: string) {
    try {
      const casts = await this.castModel
        .find({
          movieId,
        })
        .sort({ order: 'ascending' });

      return casts;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
}
