import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from '../enum/userRole.enum';
import { UserService } from '../user.service';

@Injectable()
export class AdminOrSelfGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assuming you have a user object in the request
    const userIdInParam = +request.params.id; // Assuming you pass the user ID in the request parameters

    // Check if the user is an admin
    if (user.role === UserRoleEnum.ADMIN) {
      return true;
    }

    // Check if the user ID in the parameter matches the authenticated user's ID
    if (user.id === userIdInParam) {
      return true;
    }

    // If the user is neither an admin nor the user with the ID in the parameter, deny access
    throw new UnauthorizedException(
      'You do not have permission to acces this ressource (Only  admins and account owner  can)',
    );
  }
}
