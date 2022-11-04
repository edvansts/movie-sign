export enum MEDIA_TYPE {
  'all' = 'all',
  'movie' = 'movie',
  'tv' = 'tv',
  'person' = 'person',
}

export type TDepartment =
  | 'Sound'
  | 'Editing'
  | 'Production'
  | 'Writing'
  | 'Costume & Make-Up'
  | 'Directing'
  | 'Art'
  | 'Acting'
  | 'Crew';

export type TGender = 'F' | 'M' | 'NB';

export enum SEARCH_TYPES {
  people = 'people',
  movie = 'movie',
  tv = 'tv',
}
