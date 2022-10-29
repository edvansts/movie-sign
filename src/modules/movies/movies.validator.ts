import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsOptional, IsNumberString } from 'class-validator';

export class SearchByNameQueryParams {
  @ApiProperty()
  @IsString()
  @Length(3, 30)
  query: string;

  @ApiProperty()
  @IsNumberString(30)
  @IsOptional()
  limit: number;
}
