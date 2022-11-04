import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsOptional,
  IsNumberString,
  Max,
} from 'class-validator';

export class SearchAllQueryParams {
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  query: string;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  @Max(30)
  limit: number;

  @ApiProperty()
  @IsNumberString()
  @IsOptional()
  page: number;
}
