import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ApiKeyController } from './api-key.controller';
import { ApiKeysBusinessModule } from '../business/api-keys-business.module';
import { ApiKeyDtoConverter } from './api-key-dto.converter';

@Module({
  controllers: [ApiKeyController],
  providers: [ApiKeyDtoConverter],
  imports: [AuthModule, ApiKeysBusinessModule],
})
export class ApiKeyNetworkModule {}
