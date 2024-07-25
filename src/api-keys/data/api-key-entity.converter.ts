import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKey } from './api-key.interface';

@Injectable()
export class ApiKeyEntityConverter {
  public fromEntity(entity: ApiKeyEntity): ApiKey {
    return {
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      token: entity.token,
      userId: entity.userId,
      nickname: entity.nickname,
    };
  }
}
