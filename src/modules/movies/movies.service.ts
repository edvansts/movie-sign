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
import { startOfWeek, endOfWeek, differenceInMonths } from 'date-fns';
import { SearchByNameQueryParams } from './movies.validator';
import { numberSortByKey } from 'src/helpers/array';
import {
  SearchQueries,
  SearchQueriesDocument,
} from 'src/schemas/searched-queries.schema';
import { MEDIA_TYPE } from 'src/types';
import { getImageUrl } from 'src/helpers';
import { CastService } from '../cast/cast.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Trending.name) private trendingModel: Model<TrendingDocument>,
    @InjectModel(SearchQueries.name)
    private searchedQueriesModel: Model<SearchQueriesDocument>,
    private readonly theMovieDbService: TheMovieDbService,
    private readonly castService: CastService,
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
        await this.updateMovie(dbMovie);
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
      backdrop_path,
      adult,
    } = await this.theMovieDbService.getMovieById(tmdbId);

    const newMovieModel = new this.movieModel({
      title: title || original_title,
      lastRating: vote_average,
      releaseDate: new Date(release_date),
      lastPopularity: popularity,
      imdbId: imdb_id,
      tmdbId: newTmdbId,
      posterImage: poster_path ?? getImageUrl(poster_path),
      backdropImage: backdrop_path ?? getImageUrl(backdrop_path),
      overview: overview || '',
      originalTitle: original_title || '',
      adult,
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
    const movie = await this.movieModel.findById(movieId);

    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }

    return movie;
  }

  async updateMovie(movie: MovieDocument) {
    try {
      const { vote_average, popularity } =
        await this.theMovieDbService.getMovieById(movie.tmdbId);

      movie.lastPopularity = popularity;
      movie.lastRating = vote_average;

      await movie.save();
    } catch {}
  }
}
