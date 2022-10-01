import { Length, IsString, IsEmail } from 'class-validator';

export class RegisterBody {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
