import { Injectable } from '@nestjs/common';
import { AuthError, SupabaseClient } from '@supabase/supabase-js';
import {
  EmailInUseError,
  EmailNotConfirmedError,
  InvalidCredentialsError,
  InvalidTokenError,
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

  public async resendEmailVerification(email: string): Promise<void> {
    const { error } = await this.supabaseClient.auth.resend({
      email,
      type: 'signup',
    });

    this.handleError(error);
  }

  public async verifyEmail(email: string, token: string): Promise<UserTokens> {
    const { data, error } = await this.supabaseClient.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    this.handleError(error);

    return {
      access: data.session.access_token,
      refresh: data.session.refresh_token,
    };
  }

  public async refreshTokens(token: string): Promise<UserTokens> {
    const { data, error } = await this.supabaseClient.auth.refreshSession({
      refresh_token: token,
    });

    this.handleError(error);

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
      case 'Email not confirmed':
        throw new EmailNotConfirmedError();
      case 'Token has expired or is invalid':
        throw new InvalidTokenError();
      default:
        throw error;
    }
  }
}
