import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthenticatedUserId } from 'src/users/network/authenticated-user-id.decorator';
import { ApiKeysService } from '../business/api-keys.service';
import { ApiKeyDtoConverter } from './api-key-dto.converter';
import { ApiKeyDto } from './api-key.dto';

@Controller('api-keys')
export class ApiKeyController {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly converter: ApiKeyDtoConverter,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  public async create(@AuthenticatedUserId() id: number): Promise<ApiKeyDto> {
    const key = await this.apiKeysService.createForUser(id);
    return this.converter.toDto(key);
  }
}
