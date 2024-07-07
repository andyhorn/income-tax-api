import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

@Injectable()
export class UserEntityConverter {
  public fromEntity(entity: UserEntity): User {
    return {
      uuid: entity.uuid,
      email: entity.email,
    };
  }
}
