import { Injectable } from '@nestjs/common';
import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import { UsersService } from 'src/users/business/users.service';
import { SignInParams, UserTokens } from './auth.interface';
import { EmailInUseError, InvalidCredentialsError } from './auth.error';

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

  public async create({ email, password }: SignInParams): Promise<UserTokens> {
    const { data, error } = await this.authClient.auth.signUp({
      email,
      password,
    });

    this.handleError(error);

    await this.usersService.create(data.user.id);

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
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
      default:
        throw error;
    }
  }
}
