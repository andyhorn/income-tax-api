import { Module } from '@nestjs/common';
import { UsersDataModule } from 'src/users/data/users-data.module';
import { ApiKeyDataModule } from '../data/api-key-data.module';
import { ApiKeyEncryptionService } from './api-key-encryption.service';
import { ApiKeysService } from './api-keys.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ApiKeyDataModule, UsersDataModule, ConfigModule],
  providers: [ApiKeysService, ApiKeyEncryptionService],
  exports: [ApiKeysService],
})
export class ApiKeysBusinessModule {}
