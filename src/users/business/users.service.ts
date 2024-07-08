import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../data/users.repository';
import { User } from '../data/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  public async findByEmail(email: string): Promise<User | null> {
    return await this.repository.find(email);
  }
}
