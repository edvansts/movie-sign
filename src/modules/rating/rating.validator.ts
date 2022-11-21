import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class RatingBody {
  @ApiProperty({ minimum: 0, maximum: 5 })
  @IsNumber()
  @Min(1)
  @Max(5)
  grade: number;

  @ApiProperty({ description: 'Cast id of the favorite performance' })
  @IsString()
  favoritePerformance: string;
}
