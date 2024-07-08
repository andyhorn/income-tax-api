import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ApiKeysBusinessModule } from '../business/api-keys-business.module';
import { ApiKeyController } from './api-key.controller';

@Module({
  controllers: [ApiKeyController],
  imports: [AuthModule, ApiKeysBusinessModule],
})
export class ApiKeyNetworkModule {}
