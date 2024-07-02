import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return false;
    }

    const token = auth.split(' ')[1];
    const payload = await this.jwtService.verifyAsync(token);

    (req as any)['user'] = payload;

    return true;
  }
}
