export type TMediaTypes = 'all' | 'movie' | 'tv' | 'person';

export type TTimeWindow = 'day' | 'week';

export type DtoTrending = {
  page: number;
  results?: {
    poster_path?: string | null;
    adult?: boolean;
    overview?: string;
    release_date?: string;
    genre_ids?: string[];
    id?: number;
    original_title?: string;
    original_language?: string;
    title?: string;
    popularity?: number;
    backdrop_path?: string | null;
    vote_count?: number;
    video?: boolean;
    vote_average?: number;
  }[];
  total_pages: number;
  total_results: number;
};
