import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ApiKeysService } from 'src/api-keys/business/api-keys.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const key = <string>req.headers['x-api-key'];

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
}
