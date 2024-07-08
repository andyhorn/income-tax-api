import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiKeyEncryptionService } from 'src/api-keys/business/api-key-encryption.service';
import { ApiKeysService } from 'src/api-keys/business/api-keys.service';
import { ApiKey } from 'src/api-keys/data/api-key.interface';

export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyEncryptionService: ApiKeyEncryptionService,
    private readonly apiKeysService: ApiKeysService,
    private readonly configService: ConfigService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const { key, id } = this.getHeaders(req);

    if (!key || !id) {
      throw new UnauthorizedException();
    }

    const apiKey = await this.apiKeysService.find(key);

    if (!apiKey) {
      throw new UnauthorizedException();
    }

    const decrypted = await this.decrypt(apiKey);

    if (decrypted != id) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private getHeaders(req: Request): { key?: string; id?: string } {
    return {
      key: req.headers.get('x-api-key'),
      id: req.headers.get('x-account-id'),
    };
  }

  private async decrypt(apiKey: ApiKey): Promise<string> {
    const secretKey = this.configService.getOrThrow<string>(
      'SUPABASE_JWT_SECRET',
    );

    return await this.apiKeyEncryptionService.decrypt(
      secretKey,
      Buffer.from(apiKey.iv),
    );
  }
}
