import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersBusinessModule } from 'src/users/business/users-business.module';
import { AuthDataModule } from '../data/auth-data.module';
import { AuthService } from './auth.service';

@Module({
  providers: [AuthService],
  imports: [
    AuthDataModule,
    UsersBusinessModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret:
            config.get<string>('SUPABASE_JWT_SECRET') ??
            'super-secret-jwt-token-with-at-least-32-characters-long',
        };
      },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthBusinessModule {}
