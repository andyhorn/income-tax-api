import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/business/users.service';
import { User, UserRole } from 'src/users/data/user.interface';
import { USER_ID_REQUEST_KEY } from './auth.guard';

export const Role = Reflector.createDecorator<string>();

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get(Role, context.getHandler());

    if (!role) {
      return true;
    }

    const req: Request = context.switchToHttp().getRequest();
    const userId: string = req[USER_ID_REQUEST_KEY];

    if (!userId) {
      return false;
    }

    const user = await this.usersService.find(+userId);

    return this.validateRole(role, user);
  }

  private validateRole(role: string, user: User): boolean {
    if (role == UserRole.USER) {
      return true;
    }

    return user.role == UserRole.ADMIN;
  }
}
