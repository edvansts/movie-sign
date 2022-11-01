import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { endOfWeek, startOfWeek } from 'date-fns';
import differenceInDays from 'date-fns/differenceInDays';
import { Model } from 'mongoose';
import { getImageUrl, numberSortByKey } from 'src/helpers';
import { Trending, TrendingDocument } from 'src/schemas/trending.schema';
import { TvShow, TvShowDocument } from 'src/schemas/tv-show.schema';
import { MEDIA_TYPE } from 'src/types';
import { SeasonService } from '../season/season.service';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import { DtoTvShow } from '../the-movie-db/types';
import { defaulTvShowSchema } from './constants';

@Injectable()
export class TvShowsService {
  constructor(
    private readonly theMovieDbService: TheMovieDbService,
    private readonly seasonService: SeasonService,
    @InjectModel(Trending.name) private trendingModel: Model<TrendingDocument>,
    @InjectModel(TvShow.name) private tvShowModel: Model<TvShowDocument>,
  ) {}

  async getTrending() {
    try {
      const today = new Date();
      const weekTrending = await this.trendingModel.findOne({
        type: MEDIA_TYPE.tv,
        startedAt: {
          $lt: today,
        },
        endedAt: {
          $gt: today,
        },
      });

      if (weekTrending) {
        const list = await this.tvShowModel
          .find({
            _id: {
              $in: weekTrending.list,
            },
          })
          .sort({ lastPopularity: 'desc' });

        return list;
      }

      const { results: tvShows } =
        await this.theMovieDbService.getTrendingTvShows();

      const tvShowsList = (
        await Promise.all(
          tvShows.map(async (tvShow) => {
            const { id, popularity, vote_average } = tvShow;

            try {
              if (!id) {
                return null;
              }

              const response = await this.getTvShowByTmdbId(id, {
                lastPopularity: popularity,
                lastRating: vote_average,
              });

              return response;
            } catch (err) {
              return null;
            }
          }),
        )
      ).filter((tvShow) => !!tvShow);

      const sortedList = numberSortByKey('lastPopularity', tvShowsList, 'desc');

      this.trendingModel.create({
        startedAt: startOfWeek(today),
        endedAt: endOfWeek(today),
        type: MEDIA_TYPE.tv,
        list: sortedList.map(({ _id }) => _id),
      });

      return tvShowsList;
    } catch (err) {
      throw new HttpException(err, HttpStatus.NOT_FOUND);
    }
  }

  private async getTvShowByTmdbId(
    tmdbId: number | string,
    additionalData?: {
      lastPopularity: number;
      lastRating: number;
      inProduction?: boolean;
      numberOfEpisodes?: number;
      numberOfSeasons?: number;
      lastAirDate?: Date;
    },
  ) {
    const tvShowFromDb = await this.tvShowModel.findOne({
      tmdbId: tmdbId,
    });

    if (tvShowFromDb) {
      if (additionalData) {
        tvShowFromDb.update({
          $set: {
            ...additionalData,
          },
        });
      }

      return tvShowFromDb;
    }

    const dtoTvShow = await this.theMovieDbService.getTvShowById(tmdbId);

    const newTvShow = this.normalizeDtoTvShow(dtoTvShow);

    await newTvShow.save();

    (dtoTvShow.seasons || []).map(
      async ({ season_number }) =>
        await this.seasonService.getSeasonByTmdbId(
          newTvShow.tmdbId,
          season_number,
          newTvShow._id,
        ),
    );

    return newTvShow;
  }

  async getTvShowById(tvShowId: string) {
    const tvShow = await this.tvShowModel.findById(tvShowId, {
      ...defaulTvShowSchema,
      tmdbId: 1,
    });

    if (!tvShow) {
      throw new NotFoundException('Série não encontrada');
    }

    if (differenceInDays(tvShow.updatedAt, new Date()) >= 7) {
      await this.updateTvShow(tvShow);
    }

    return tvShow;
  }

  private async updateTvShow(tvShow: TvShowDocument) {
    try {
      const {
        in_production,
        last_air_date,
        last_episode_to_air,
        number_of_seasons,
        number_of_episodes,
        vote_average,
        next_episode_to_air,
        popularity,
      } = await this.theMovieDbService.getTvShowById(tvShow.tmdbId);

      tvShow.inProduction = in_production;
      tvShow.numberOfEpisodes = number_of_episodes;
      tvShow.numberOfSeasons = number_of_seasons;
      tvShow.lastPopularity = popularity;
      tvShow.lastRating = vote_average;
      tvShow.lastAirDate = new Date(last_air_date);

      if (last_episode_to_air) {
        tvShow.lastEpisodeToAir = {
          airDate: last_episode_to_air.air_date,
          episodeNumber: last_episode_to_air.episode_number,
          id: last_episode_to_air.id,
          name: last_episode_to_air.name,
          overview: last_episode_to_air.overview,
          seasonNumber: last_episode_to_air.season_number,
          voteAverage: last_episode_to_air.vote_average,
        };
      }

      if (next_episode_to_air) {
        tvShow.nextEpisodeToAir = {
          airDate: next_episode_to_air.air_date,
          episodeNumber: next_episode_to_air.episode_number,
          id: next_episode_to_air.id,
          name: next_episode_to_air.name,
          overview: next_episode_to_air.overview,
          seasonNumber: next_episode_to_air.season_number,
          voteAverage: next_episode_to_air.vote_average,
        };
      }

      await tvShow.save();
    } catch {}
  }

  private normalizeDtoTvShow(dtoTvShow: DtoTvShow) {
    const {
      name,
      original_name,
      overview,
      popularity,
      vote_average,
      first_air_date,
      last_air_date,
      poster_path,
      backdrop_path,
      imdb_id,
      id: newTmdbId,
      adult,
      created_by,
      genres,
      homepage,
      in_production,
      last_episode_to_air,
      next_episode_to_air,
      number_of_episodes,
      number_of_seasons,
      tagline,
      production_companies,
      status,
    } = dtoTvShow;

    const newTvShow = new this.tvShowModel({
      inProduction: in_production,
      numberOfEpisodes: number_of_episodes,
      numberOfSeasons: number_of_seasons,
      lastPopularity: popularity,
      lastRating: vote_average,
      lastAirDate: new Date(last_air_date),
      homepage,
      name: name || original_name,
      originalName: original_name,
      overview: overview || '',
      firstAirDate: new Date(first_air_date),
      posterImage: poster_path ?? getImageUrl(poster_path),
      backdropImage: backdrop_path ?? getImageUrl(backdrop_path),
      tmdbId: newTmdbId,
      imdbId: imdb_id,
      createdBy: created_by,
      genres,
      adult,
      tagline,
      productionCompanies: production_companies,
      status,
    });

    if (last_episode_to_air) {
      newTvShow.lastEpisodeToAir = {
        airDate: last_episode_to_air.air_date,
        episodeNumber: last_episode_to_air.episode_number,
        id: last_episode_to_air.id,
        name: last_episode_to_air.name,
        overview: last_episode_to_air.overview,
        seasonNumber: last_episode_to_air.season_number,
        voteAverage: last_episode_to_air.vote_average,
      };
    }

    if (next_episode_to_air) {
      newTvShow.nextEpisodeToAir = {
        airDate: next_episode_to_air.air_date,
        episodeNumber: next_episode_to_air.episode_number,
        id: next_episode_to_air.id,
        name: next_episode_to_air.name,
        overview: next_episode_to_air.overview,
        seasonNumber: next_episode_to_air.season_number,
        voteAverage: next_episode_to_air.vote_average,
      };
    }

    return newTvShow;
  }
}
