import { SEARCH_TYPES } from 'src/types';

export type TTimeWindow = 'day' | 'week';

export type TMovieProductionStatus =
  | 'Rumored'
  | 'Planned'
  | 'In Production'
  | 'Post Production'
  | 'Released'
  | 'Canceled';

export interface MinimalMovie {
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

export interface MinimalTvShow {
  poster_path?: string | null;
  adult?: boolean;
  id?: number;
  original_name?: string;
  original_language?: string;
  name?: string;
  backdrop_path?: string | null;
  overview?: string;
  first_air_date: string;
  genre_ids?: string[];
  popularity?: number;
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
  origin_country?: string[];
}

export type DtoTrending<T> = {
  page: number;
  results?: T[];
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
  status: TMovieProductionStatus;
};

export type DtoTvShow = {
  adult?: boolean;
  backdrop_path?: string | null;
  created_by?: {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string | null;
  }[];
  genres: {
    id: number;
    name: string;
  }[];
  homepage: string | null;
  in_production: boolean;
  episode_run_time: number[];
  first_air_date: string;
  last_air_date: string;
  poster_path?: string | null;
  last_episode_to_air: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  };
  next_episode_to_air?: {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  };
  networks: {
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }[];
  number_of_episodes: number;
  number_of_seasons: number;
  overview: string | null;
  original_language?: string;
  original_name?: string;
  name?: string;
  popularity?: number;
  genre_ids?: string[];
  vote_count?: number;
  video?: boolean;
  vote_average?: number;
  id: number;
  tagline?: string;
  imdb_id?: string | null;
  production_companies: {
    name: string;
    id: number;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  seasons: {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }[];
  status: string;
  languages: string[];
};

export type DtoSearchMovie = {
  page: number;
  results?: MinimalMovie[];
  total_pages: number;
  total_results: number;
};

export type DtoMovieCredits = {
  id: string;
  cast: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
  }[];
  crew: {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    credit_id: string;
    department: string;
    job: string;
  }[];
};

export interface DtoSeason {
  _id: string;
  air_date: string;
  episodes: {
    air_date: string;
    episode_number: number;
    crew?: any[];
    guestStars?: any[];
    id: number;
    name: string;
    overview: string;
    production_code: string;
    season_number?: number;
    still_path?: string;
    vote_average?: number;
    vote_count?: number;
  }[];
  name: string;
  overview: string;
  id: string;
  poster_path?: string | null;
  season_number: number;
}

export type DtoSearchedPeople = {
  profille_path?: string | null;
  adult?: boolean;
  id: number;
  media_type: SEARCH_TYPES.people;
  known_for: DtoSearchedTvShow | DtoSearchedMovie;
  name?: string;
  popularity?: number;
};

export interface DtoSearchedMovie extends MinimalMovie {
  media_type: SEARCH_TYPES.movie;
}

export interface DtoSearchedTvShow {
  poster_path?: string | null;
  popularity?: string;
  overview?: string;
  backdrop_path?: string | null;
  media_type: SEARCH_TYPES.tv;
  vote_average?: number;
  first_air_date?: string;
  origin_country?: string[];
  genre_ids?: number[];
  original_language?: string;
  vote_count?: number;
  name?: string;
  original_name?: string;
  id?: number;
}

export interface DtoMultiSearch {
  total_pages: number;
  total_results: number;
  page: number;
  results: (DtoSearchedMovie | DtoSearchedTvShow | DtoSearchedPeople)[];
}
