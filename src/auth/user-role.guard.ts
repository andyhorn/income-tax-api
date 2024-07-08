import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/business/users.service';
import { User, UserRole } from 'src/users/data/user.interface';
import { USER_ID_REQUEST_KEY } from './auth.guard';

export const Roles = Reflector.createDecorator<string[]>();

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();
    const userId: string = req[USER_ID_REQUEST_KEY];

    if (!userId) {
      return false;
    }

    const user = await this.usersService.find(+userId);

    return this.validateRoles(roles, user);
  }

  private validateRoles(roles: string[], user: User): boolean {
    if (roles.includes(UserRole.ADMIN)) {
      return user.role == UserRole.ADMIN;
    }

    return true;
  }
}
