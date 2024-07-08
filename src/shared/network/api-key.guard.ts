import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';
import { ApiKeysService } from 'src/api-keys/business/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const key = this.extractApiKey(req.headers);

    if (!key) {
      throw new UnauthorizedException('Missing API Key');
    }

    const hashed = this.apiKeysService.hash(key);
    const apiKey = await this.apiKeysService.find(hashed);

    if (!apiKey || apiKey.deletedAt) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true;
  }

  private extractApiKey(headers: IncomingHttpHeaders): string | null {
    const key = headers['x-api-key'];

    if (Array.isArray(key)) {
      if (key.length) {
        return key[0];
      }

      return null;
    }

    return key ?? null;
  }
}
