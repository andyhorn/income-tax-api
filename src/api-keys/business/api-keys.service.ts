import { Injectable } from '@nestjs/common';
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

  public async createForUser(uuid: string): Promise<ApiKey> {
    const token = this.jwtService.sign(uuid);
    const user = await this.usersRepository.findByUuid(uuid);
    return await this.apiKeysRepository.save({ userId: user.id, token });
  }
}
