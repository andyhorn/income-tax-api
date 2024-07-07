import { Module } from '@nestjs/common';
import { UsersDataModule } from '../data/users-data.module';
import { UsersService } from './users.service';

@Module({
  imports: [UsersDataModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersBusinessModule {}
