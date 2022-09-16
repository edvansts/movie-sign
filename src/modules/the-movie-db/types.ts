export type TTimeWindow = 'day' | 'week';

export type TProductionStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';

interface MinimalMovie {
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
}

export type DtoTrending = {
  page: number;
  results?: MinimalMovie[];
  total_pages: number;
  total_results: number;
};

export type DtoMovie = {
  poster_path?: string | null;
  adult?: boolean;
  overview: string | null;
  release_date?: string;
  genre_ids?: string[];
  original_title?: string;
  original_language?: string;
  title?: string;
  popularity?: number;
  backdrop_path?: string | null;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
  budget: number;
  id: number;
  imdb_id: string | null;
  production_companies: {
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }[];
  status: TProductionStatus;
};

export type DtoSearchMovie = {
  page: number;
  results?: MinimalMovie[];
  total_pages: number;
  total_results: number;
};
