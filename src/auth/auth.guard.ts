import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const token = this.extractToken(req);

    if (!token) {
      return false;
    }

    const uuid = await this.extractUuid(token);
    this.setUuid(req, uuid);

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

  private setUuid(req: Request, uuid: string): void {
    (req as any)['user'] = uuid;
  }
}
