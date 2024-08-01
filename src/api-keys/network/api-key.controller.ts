import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/network/auth.guard';
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
  public async create(
    @AuthenticatedUserId() id: number,
    @Body() { nickname }: { nickname?: string },
  ): Promise<{ token: string }> {
    const token = await this.apiKeysService.createForUser(id, nickname);
    return { token };
  }

  @UseGuards(AuthGuard)
  @Get()
  public async getForUser(
    @AuthenticatedUserId() id: number,
  ): Promise<ApiKeyDto[]> {
    const keys = await this.apiKeysService.findForUser(id);
    return keys.map(this.converter.toDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Param('id', ParseIntPipe) id: number,
    @AuthenticatedUserId() userId: number,
  ): Promise<void> {
    return await this.apiKeysService.delete({
      keyId: id,
      userId,
    });
  }
}
