import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UsersRepository } from 'src/users/data/users.repository';
import { ApiKey, ApiKeyDeleteParams } from '../data/api-key.interface';
import { ApiKeyRepository } from '../data/api-key.repository';

const KEY_LENGTH = 16;

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly apiKeysRepository: ApiKeyRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async createForUser(
    userId: number,
    nickname?: string,
  ): Promise<string> {
    const user = await this.usersRepository.find(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const { hash, key } = await this.generateUniqueKey();

    await this.apiKeysRepository.save({ userId, hash, nickname });

    return key;
  }

  private async generateUniqueKey(): Promise<{ hash: string; key: string }> {
    let exists = false,
      key: string,
      hash: string;

    do {
      key = this.generateKey(KEY_LENGTH);
      hash = this.hash(key);
      exists = await this.apiKeysRepository.exists(hash);
    } while (exists);

    return { key, hash };
  }

  public async find(key: string): Promise<ApiKey | null> {
    return await this.apiKeysRepository.findOne({
      token: key,
    });
  }

  public async findForUser(userId: number): Promise<ApiKey[]> {
    return this.apiKeysRepository.findMany({
      userId,
    });
  }

  public async markUsed(hash: string): Promise<ApiKey | null> {
    return await this.apiKeysRepository.markUsed(hash);
  }

  public async delete(params: ApiKeyDeleteParams): Promise<void> {
    return await this.apiKeysRepository.delete(params);
  }

  public hash(token: string): string {
    return createHash('sha256').update(token).digest('base64');
  }

  private generateKey(length: number): string {
    return randomBytes(length).toString('base64');
  }
}
