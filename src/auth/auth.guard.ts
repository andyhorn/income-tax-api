import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/business/users.service';
import { User } from 'src/users/data/user.interface';

export const USER_ID_REQUEST_KEY = 'userId';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = this.extractToken(req);

    if (!token) {
      return false;
    }

    const uuid = await this.extractUuid(token);
    const user = await this.findUser(uuid);
    this.setUserId(req, user);

    return true;
  }

  private extractToken(req: Request): string | null {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return null;
    }

    return auth.split(' ')[1];
  }

  private async extractUuid(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.sub;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  private async findUser(uuid: string): Promise<User> {
    const user = await this.usersService.findByUuid(uuid);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private setUserId(req: Request, user: User): void {
    (req as any)[USER_ID_REQUEST_KEY] = user.id;
  }
}
