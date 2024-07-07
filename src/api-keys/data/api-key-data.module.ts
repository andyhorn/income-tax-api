import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyEntityConverter } from './api-key-entity.converter';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKeyRepository } from './api-key.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ApiKeyEntity])],
  providers: [ApiKeyRepository, ApiKeyEntityConverter],
  exports: [ApiKeyRepository],
})
export class ApiKeyDataModule {}
