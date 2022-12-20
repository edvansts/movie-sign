import type { Movie } from 'src/schemas/movie.schema';
import { Rating } from 'src/schemas/rating.schema';

export interface IMovieWithRating extends Movie {
  rating: Rating;
}
