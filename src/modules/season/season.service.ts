import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { valueOrUndefined } from 'src/helpers';
import { IEpisode, Season, SeasonDocument } from 'src/schemas/season.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';

@Injectable()
export class SeasonService {
  constructor(
    private readonly theMovieDbService: TheMovieDbService,
    @InjectModel(Season.name)
    private readonly seasonModel: Model<SeasonDocument>,
  ) {}

  async getSeasonByTmdbId(
    tvShowTmdbId: string | number,
    seasonNumber: number,
    tvShowId: ObjectId,
  ) {
    try {
      const findedSeason = await this.seasonModel.findOne({
        tvShowId: tvShowId,
        tmdbId: tvShowTmdbId,
      });

      if (findedSeason) {
        return findedSeason;
      }

      const {
        name,
        id,
        air_date,
        episodes,
        overview,
        season_number,
        poster_path,
      } = await this.theMovieDbService.getSeasonByTvShowId(
        tvShowTmdbId,
        seasonNumber,
      );

      const newSeason = new this.seasonModel({
        name: name,
        tmdbId: id,
        airDate: valueOrUndefined(air_date),
        overview: overview || '',
        posterImage: valueOrUndefined(poster_path),
        seasonNumber: valueOrUndefined(season_number),
        tvShowId,
      });

      newSeason.episodes = (episodes || []).map<IEpisode>(
        ({ air_date, episode_number, id, name, overview, vote_average }) => ({
          episodeNumber: episode_number,
          name,
          tmdbId: id,
          airDate: valueOrUndefined(new Date(air_date)),
          overview: overview || '',
          lastRating: vote_average,
        }),
      );

      const createdSeason = await this.seasonModel.create(newSeason);

      return createdSeason;
    } catch (err) {
      console.log(err);
    }
  }
}
