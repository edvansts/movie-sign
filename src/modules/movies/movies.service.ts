import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { defaultImgUrlTmdb } from 'src/constants';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { Trending, TrendingDocument } from 'src/schemas/trending.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import { startOfWeek, endOfWeek } from 'date-fns';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    @InjectModel(Trending.name) private trendingModel: Model<TrendingDocument>,
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
            id: {
              $elemMatch: {
                $in: weekTrending.list,
              },
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
            try {
              if (!movie.id) {
                return null;
              }

              const dbMovie = await this.movieModel.findOne({
                tmdbId: movie.id,
              });

              if (dbMovie) {
                dbMovie.update({
                  $set: {
                    lastPopularity: movie.popularity,
                    lastRating: movie.vote_average,
                  },
                });

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
                id: tmdbId,
                overview,
              } = await this.theMovieDbService.getMovieById(movie.id);

              const newMovieModel = new this.movieModel({
                title: title || original_title,
                lastRating: vote_average,
                releaseDate: new Date(release_date),
                lastPopularity: popularity,
                imdbId: imdb_id,
                tmdbId,
                posterImage: poster_path
                  ? `${defaultImgUrlTmdb}${poster_path}`
                  : null,
                overview: overview || '',
                originalTitle: original_title || '',
              });

              const createdMovie = await this.movieModel.create(newMovieModel);

              return createdMovie;
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((movie) => !!movie);

      const listIds = moviesList
        .sort((a, b) => b.lastPopularity - a.lastPopularity)
        .map(({ _id }) => _id);

      this.trendingModel.create({
        startedAt: startOfWeek(today),
        endedAt: endOfWeek(today),
        type: 'movie',
        list: listIds,
      });

      return moviesList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }
}
