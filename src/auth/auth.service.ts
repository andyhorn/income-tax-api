import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { UsersService } from 'src/users/business/users.service';
import { SignInParams, UserTokens } from './auth.interface';
import { EmailInUseError } from './auth.error';

@Injectable()
export class AuthService {
  constructor(
    private readonly authClient: SupabaseClient,
    private readonly usersService: UsersService,
  ) {}

  public async login({ email, password }: SignInParams): Promise<UserTokens> {
    const { data } = await this.authClient.auth.signInWithPassword({
      email,
      password,
    });

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }

  public async create({ email, password }: SignInParams): Promise<UserTokens> {
    const { data, error } = await this.authClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      switch (error.message) {
        case 'User already registered':
          throw new EmailInUseError();
        default:
          throw error;
      }
    }

    await this.usersService.create(data.user.id);

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }
}
