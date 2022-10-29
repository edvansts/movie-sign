import { Length, IsString } from 'class-validator';

export class LoginBody {
  @IsString()
  user: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
