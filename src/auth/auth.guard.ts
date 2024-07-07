import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/business/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return false;
    }

    const token = auth.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token);

    (req as any)['user'] = await this.usersService.findByEmail(payload.email);

    return true;
  }
}
