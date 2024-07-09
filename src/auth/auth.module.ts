import { Module } from '@nestjs/common';
import { AuthNetworkModule } from './network/auth-network.module';
import { AuthBusinessModule } from './business/auth-business.module';

@Module({
  imports: [AuthNetworkModule, AuthBusinessModule],
  exports: [AuthNetworkModule],
})
export class AuthModule {}
