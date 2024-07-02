import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    ConfigModule,
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
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: SupabaseClient,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new SupabaseClient(
          config.get<string>('SUPABASE_URL') ?? 'http://127.0.0.1:54321',
          config.get<string>('SUPABASE_KEY') ??
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        );
      },
    },
  ],
  exports: [AuthGuard, JwtModule],
})
export class AuthModule {}
