import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRoleEnum } from '../enum/userRole.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user; // Assuming you have a user object in the request

    if (!user || user.role !== UserRoleEnum.ADMIN) {
      throw new UnauthorizedException(
        'You do not have permission to acces this ressource (Only  admins can)',
      );
    }

    return true;
  }
}
