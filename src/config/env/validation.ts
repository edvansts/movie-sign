import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Stage = 'stage',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  THE_MOVIE_DB_API_KEY: string;

  @IsString()
  PASSWORD_SECRET: string;
  @IsString()
  USER_AUTH_SECRET: string;

  @IsString()
  REDIS_HOST: string;
  @IsString()
  REDIS_PORT: string;
  @IsString()
  REDIS_PASSWORD: string;

  @IsString()
  GOOGLE_AUTH_CLIENT_ID: string;
  @IsString()
  GOOGLE_AUTH_CLIENT_SECRET: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
