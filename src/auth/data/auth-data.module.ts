import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { AuthClient } from './auth.client';

@Module({
  providers: [
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
    AuthClient,
  ],
  imports: [ConfigModule],
  exports: [AuthClient, SupabaseClient],
})
export class AuthDataModule {}
