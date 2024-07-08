import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { ApiKeysBusinessModule } from '../business/api-keys-business.module';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyDtoConverter } from './api-key-dto.converter';

@Module({
  providers: [ApiKeyDtoConverter],
  controllers: [ApiKeyController],
  imports: [AuthModule, ApiKeysBusinessModule],
})
export class ApiKeyNetworkModule {}
