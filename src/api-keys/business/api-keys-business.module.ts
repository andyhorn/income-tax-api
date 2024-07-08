import { Module } from '@nestjs/common';
import { ApiKeyDataModule } from '../data/api-key-data.module';
import { ApiKeysService } from './api-keys.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersDataModule } from 'src/users/data/users-data.module';

@Module({
  imports: [ApiKeyDataModule, AuthModule, UsersDataModule],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysBusinessModule {}
