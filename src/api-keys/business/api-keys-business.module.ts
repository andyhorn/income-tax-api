import { Module } from '@nestjs/common';
import { UsersDataModule } from 'src/users/data/users-data.module';
import { ApiKeyDataModule } from '../data/api-key-data.module';
import { ApiKeysService } from './api-keys.service';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyGuard } from 'src/api-keys/network/api-key.guard';

@Module({
  imports: [ApiKeyDataModule, UsersDataModule, ConfigModule],
  providers: [ApiKeysService, ApiKeyGuard],
  exports: [ApiKeysService],
})
export class ApiKeysBusinessModule {}
