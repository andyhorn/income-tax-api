import { Injectable } from '@nestjs/common';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKey } from './api-key.interface';

@Injectable()
export class ApiKeyEntityConverter {
  public fromEntity(entity: ApiKeyEntity): ApiKey {
    return {
      id: entity.id,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
      hash: entity.hash,
      userId: entity.userId,
      nickname: entity.nickname,
    };
  }
}
