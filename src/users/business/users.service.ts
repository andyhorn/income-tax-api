import { Injectable } from '@nestjs/common';
import { User } from '../data/user.interface';
import { UsersRepository } from '../data/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async find(userId: number): Promise<User | null> {
    return await this.repository.find(userId);
  }

  public async findByUuid(uuid: string): Promise<User | null> {
    return await this.repository.findByUuid(uuid);
  }

  public async create(uuid: string): Promise<User> {
    return await this.repository.create(uuid);
  }
}
