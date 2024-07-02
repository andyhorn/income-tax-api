import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { SignInParams, UserTokens } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: SupabaseClient) {}

  public async login({ email, password }: SignInParams): Promise<UserTokens> {
    const { data, error } = await this.authClient.auth.signInWithPassword({
      email,
      password,
    });

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }
}
