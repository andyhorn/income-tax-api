import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../data/users.repository';
import { User } from '../data/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async findByUuid(uuid: string): Promise<User | null> {
    return await this.repository.findByUuid(uuid);
  }
}
