import { Module } from '@nestjs/common';
import { UserEntityConverter } from './user-entity.converter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Module({
  providers: [UserEntityConverter, UserRepository],
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [UserRepository],
})
export class UsersDataModule {}
