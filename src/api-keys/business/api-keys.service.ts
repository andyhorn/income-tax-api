import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from 'src/users/data/users.repository';
import { ApiKey } from '../data/api-key.interface';
import { ApiKeyRepository } from '../data/api-key.repository';
import { ApiKeyEncryptionService } from './api-key-encryption.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly apiKeysRepository: ApiKeyRepository,
    private readonly usersRepository: UsersRepository,
    private readonly encryptionService: ApiKeyEncryptionService,
    private readonly configService: ConfigService,
  ) {}

  public async createForUser(userId: number): Promise<ApiKey> {
    const user = await this.usersRepository.find(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const { key, iv } = await this.encryptionService.encrypt(
      this.getSecretKey(),
      user.uuid,
    );

    return await this.apiKeysRepository.save({ userId, key, iv });
  }

  private getSecretKey(): string {
    return this.configService.getOrThrow<string>('SUPABASE_JWT_SECRET');
  }
}
