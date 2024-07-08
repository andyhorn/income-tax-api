import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { User, UserRole } from './user.interface';

@Injectable()
export class UserEntityConverter {
  public fromEntity(entity: UserEntity): User {
    return {
      id: entity.id,
      uuid: entity.uuid,
      role: UserRole[entity.role],
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    };
  }
}
