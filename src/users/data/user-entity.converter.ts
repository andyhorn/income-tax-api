import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UserEntityConverter {
  public fromEntity(entity: UserEntity): User {
    return {
      id: entity.id,
      uuid: entity.uuid,
      email: entity.email,
      createdAt: entity.createdAt,
      deletedAt: entity.deletedAt,
    };
  }
}
