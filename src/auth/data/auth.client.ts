import { Injectable } from '@nestjs/common';
import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import {
  EmailInUseError,
  EmailNotConfirmedError,
  InvalidCredentialsError,
} from '../auth.error';
import {
  LoginParams,
  SignUpParams,
  SignUpResult,
  UserTokens,
} from './auth-data.interface';

@Injectable()
export class AuthClient {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  public async login({ email, password }: LoginParams): Promise<UserTokens> {
    const { data, error } = await this.supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    this.handleError(error);

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }

  public async signUp({
    email,
    password,
  }: SignUpParams): Promise<SignUpResult> {
    const { data, error } = await this.supabaseClient.auth.signUp({
      email,
      password,
    });

    this.handleError(error);

    return { uuid: data.user.id };
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
