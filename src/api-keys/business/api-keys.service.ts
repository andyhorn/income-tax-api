import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UsersRepository } from 'src/users/data/users.repository';
import { ApiKey } from '../data/api-key.interface';
import { ApiKeyRepository } from '../data/api-key.repository';

const KEY_LENGTH = 16;

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly apiKeysRepository: ApiKeyRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async createForUser(userId: number): Promise<string> {
    const user = await this.usersRepository.find(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const key = this.generateKey(KEY_LENGTH);
    const hash = this.hash(key);

    await this.apiKeysRepository.save({ userId, hash });

    return key;
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

  public hash(token: string): string {
    return createHash('sha256').update(token).digest('base64');
  }

  private generateKey(length: number): string {
    return randomBytes(length).toString('base64');
  }
}
