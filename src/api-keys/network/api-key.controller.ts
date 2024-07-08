import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiKeysService } from '../business/api-keys.service';
import { ApiKey } from '../data/api-key.interface';
import { AuthenticatedUserId } from 'src/users/network/authenticated-user-id.decorator';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(AuthGuard)
  @Post()
  public async create(@AuthenticatedUserId() id: number): Promise<ApiKey> {
    return await this.apiKeysService.createForUser(id);
  }
}
