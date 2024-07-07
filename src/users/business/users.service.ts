import { Injectable } from '@nestjs/common';
import { UserRepository } from '../data/user.repository';
import { User } from '../data/user.interface';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UserRepository) {}

  public async findByEmail(email: string): Promise<User | null> {
    return await this.repository.find(email);
  }
}
