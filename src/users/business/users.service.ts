import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../data/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}
}
