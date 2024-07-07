import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { User } from './user.interface';
import { UserEntityConverter } from './user-entity.converter';

export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly converter: UserEntityConverter,
  ) {}

  public async find(email: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({
      email,
    });

    if (entity) {
      return this.converter.fromEntity(entity);
    }

    return null;
  }
}
