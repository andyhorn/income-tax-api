import { Injectable } from '@nestjs/common';
import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { UsersService } from 'src/users/business/users.service';
import { User } from 'src/users/data/user.interface';
import {
  EmailInUseError,
  EmailNotConfirmedError,
  InvalidCredentialsError,
} from './auth.error';
import { SignInParams, UserTokens } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly authClient: SupabaseClient,
    private readonly usersService: UsersService,
  ) {}

  public async login({ email, password }: SignInParams): Promise<UserTokens> {
    const { data, error } = await this.authClient.auth.signInWithPassword({
      email,
      password,
    });

    this.handleError(error);

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }

  public async signUp({ email, password }: SignInParams): Promise<User> {
    const { data, error } = await this.authClient.auth.signUp({
      email,
      password,
    });

    this.handleError(error);

    return await this.usersService.create(data.user.id);
  }

  private handleError(error?: AuthError): void {
    if (!error) {
      return;
    }

    switch (error.message) {
      case 'User already registered':
        throw new EmailInUseError();
      case 'Invalid login credentials':
        throw new InvalidCredentialsError();
      case 'Email not confirmed':
        throw new EmailNotConfirmedError();
      default:
        throw error;
    }
  }
}
