import { Injectable } from '@nestjs/common';
import { ApiKey } from '../data/api-key.interface';
import { ApiKeyDto } from './api-key.dto';

@Injectable()
export class ApiKeyDtoConverter {
  public toDto(key: ApiKey): ApiKeyDto {
    return {
      key: key.token,
      nickname: key.nickname,
    };
  }
}
