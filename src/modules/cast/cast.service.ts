import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getImageUrl } from 'src/helpers';
import { Cast, CastDocument } from 'src/schemas/cast.schema';
import { MovieDocument } from 'src/schemas/movie.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';
import type { TDepartment } from 'src/types';
import { PersonService } from '../person/person.service';

@Injectable()
export class CastService {
  constructor(
    @InjectModel(Cast.name) private readonly castModel: Model<CastDocument>,
    private readonly theMovieDbService: TheMovieDbService,
    private readonly personService: PersonService,
  ) {}

  async getCastByMovie(movie: MovieDocument) {
    try {
      const movieCasts = await this.getCastsByMovieId(movie.id);

      if (movieCasts.length > 0) {
        return movieCasts;
      }

      const { cast } = await this.theMovieDbService.getMovieCredits(
        movie.tmdbId,
      );

      const newCasts = Promise.all(
        cast.map(async (cast) => {
          const {
            name,
            popularity,
            gender,
            id,
            character,
            knownForDepartment,
            order,
            profilePath,
          } = cast;

          const profileImage = getImageUrl(profilePath);

          const person = await this.personService.getOrCreatePerson({
            tmdbId: id,
            name,
            gender,
            profileImage,
            lastPopularity: popularity,
          });

          return new this.castModel({
            name,
            lastPopularity: popularity,
            order,
            character,
            tmdbId: id,
            departmentWorked: knownForDepartment as TDepartment,
            profileImage,
            movieId: movie._id,
            personId: person.id,
          });
        }),
      );

      this.castModel.insertMany(newCasts);

      return newCasts;
    } catch (err) {
      throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getCastsByMovieId(movieId: string) {
    const casts = await this.castModel
      .find({
        movieId,
      })
      .sort({ order: 'ascending' });

    return casts;
  }

  async getCastById(castId: string) {
    const cast = await this.castModel.findById(castId);

    if (!cast) {
      throw new Error('Personagem não encontrado.');
    }

    return cast;
  }
}
