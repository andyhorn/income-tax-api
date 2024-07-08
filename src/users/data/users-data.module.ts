import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntityConverter } from './user-entity.converter';
import { UserEntity } from './user.entity';
import { UsersRepository } from './users.repository';

@Module({
  providers: [UserEntityConverter, UsersRepository],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UsersRepository],
})
export class UsersDataModule {}
