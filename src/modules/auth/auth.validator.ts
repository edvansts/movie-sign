import { Length, IsString, IsEmail } from 'class-validator';

export class LoginBody {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
