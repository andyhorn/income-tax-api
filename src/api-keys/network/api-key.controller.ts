import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedUserUuid } from 'src/users/network/authenticated-user-uuid.decorator';
import { ApiKeysService } from '../business/api-keys.service';
import { ApiKey } from '../data/api-key.interface';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(AuthGuard)
  @Post()
  public async create(@AuthenticatedUserUuid() uuid: string): Promise<ApiKey> {
    return await this.apiKeysService.createForUser(uuid);
  }
}
