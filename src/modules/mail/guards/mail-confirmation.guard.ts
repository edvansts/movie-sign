import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestWithUser } from 'src/types/services';

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    if (!request.user?.isEmailValidated) {
      throw new UnauthorizedException('Confirme seu email!');
    }

    return true;
  }
}
