import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/network/auth.guard';
import { AuthenticatedUserId } from 'src/users/network/authenticated-user-id.decorator';
import { ApiKeysService } from '../business/api-keys.service';
import { ApiKeyDto } from './api-key.dto';

@Controller('api-keys')
export class ApiKeyController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @UseGuards(AuthGuard)
  @Post()
  public async create(@AuthenticatedUserId() id: number): Promise<ApiKeyDto> {
    const key = await this.apiKeysService.createForUser(id);
    return { key, nickname: null };
  }
}
