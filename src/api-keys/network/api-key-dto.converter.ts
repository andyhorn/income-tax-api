import { Injectable } from '@nestjs/common';
import { ApiKey } from '../data/api-key.interface';
import { ApiKeyCreationResultDto, ApiKeyDto } from './api-key.dto';

@Injectable()
export class ApiKeyDtoConverter {
  public toDto(key: ApiKey): ApiKeyDto {
    return {
      id: key.id,
      createdAt: key.createdAt,
      nickname: key.nickname,
    };
  }

  public toCreationResultDto(key: ApiKey): ApiKeyCreationResultDto {
    return {
      id: key.id,
      createdAt: key.createdAt,
      key: key.token,
      nickname: key.nickname,
    };
  }
}
