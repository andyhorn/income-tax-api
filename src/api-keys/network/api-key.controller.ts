import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/network/auth.guard';
import { AuthenticatedUserId } from 'src/users/network/authenticated-user-id.decorator';
import { ApiKeysService } from '../business/api-keys.service';
import { ApiKeyDto } from './api-key.dto';
import { ApiKeyDtoConverter } from './api-key-dto.converter';

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
    return { nickname: null, createdAt: key.createdAt };
  }

  @UseGuards(AuthGuard)
  @Get()
  public async getForUser(
    @AuthenticatedUserId() id: number,
  ): Promise<ApiKeyDto[]> {
    const keys = await this.apiKeysService.findForUser(id);

    return keys.map(this.converter.toDto);
  }
}
