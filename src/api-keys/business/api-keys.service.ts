import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/data/users.repository';
import { ApiKey } from '../data/api-key.interface';
import { ApiKeyRepository } from '../data/api-key.repository';

@Injectable()
export class ApiKeysService {
  constructor(
    private readonly apiKeysRepository: ApiKeyRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async createForUser(userId: number): Promise<ApiKey> {
    const user = await this.usersRepository.find(userId);

    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }

    const token = this.jwtService.sign(user.uuid);
    return await this.apiKeysRepository.save({ userId, token });
  }
}
