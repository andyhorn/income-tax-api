import { Module } from '@nestjs/common';
import { UsersBusinessModule } from 'src/users/business/users-business.module';
import { AuthBusinessModule } from '../business/auth-business.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UserRoleGuard } from './user-role.guard';

@Module({
  imports: [AuthBusinessModule, UsersBusinessModule],
  controllers: [AuthController],
  providers: [AuthGuard, UserRoleGuard],
  exports: [AuthGuard, UserRoleGuard, AuthBusinessModule, UsersBusinessModule],
})
export class AuthNetworkModule {}
