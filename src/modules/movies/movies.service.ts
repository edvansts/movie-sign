import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Movie, MovieDocument } from 'src/schemas/movie.schema';
import { TheMovieDbService } from '../the-movie-db/the-movie-db.service';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private readonly theMovieDbService: TheMovieDbService,
  ) {}

  async getTrendingMovies() {
    const trendingMovies = await this.theMovieDbService.getTrending(
      'movie',
      'week',
    );

    return trendingMovies;
  }
}
