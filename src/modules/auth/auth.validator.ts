import { ApiProperty } from '@nestjs/swagger';
import { Length, IsString, IsNotEmpty } from 'class-validator';

export class LoginBody {
  @ApiProperty()
  @IsString()
  user: string;

  @ApiProperty()
  @IsString()
  @Length(8, 30)
  password: string;
}

export class SignWithGoogleBody {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}
