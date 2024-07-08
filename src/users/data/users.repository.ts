import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntityConverter } from './user-entity.converter';
import { UserEntity } from './user.entity';
import { User } from './user.interface';

export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
    private readonly converter: UserEntityConverter,
  ) {}

  public async find(id: number): Promise<User | null> {
    const entity = await this.repository.findOneBy({ id });

    if (!entity) {
      return null;
    }

    return this.converter.fromEntity(entity);
  }

  public async findByUuid(uuid: string): Promise<User | null> {
    const entity = await this.repository.findOneBy({
      uuid,
    });

    if (!entity) {
      return null;
    }

    return this.converter.fromEntity(entity);
  }
}
