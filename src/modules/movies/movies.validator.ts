import { IsString, Length, IsOptional, IsNumberString } from 'class-validator';

export class SearchByNameQueryParams {
  @IsString()
  @Length(3, 30)
  query: string;

  @IsNumberString(30)
  @IsOptional()
  limit: number;
}
