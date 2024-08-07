import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/business/users.service';
import { User } from 'src/users/data/user.interface';
import {
  LoginParams,
  SignUpParams,
  UserTokens,
} from '../data/auth-data.interface';
import { AuthClient } from '../data/auth.client';

@Injectable()
export class AuthService {
  constructor(
    private readonly authClient: AuthClient,
    private readonly usersService: UsersService,
  ) {}

  public async login(params: LoginParams): Promise<UserTokens> {
    return await this.authClient.login(params);
  }

  public async signUp(params: SignUpParams): Promise<User> {
    const { uuid } = await this.authClient.signUp(params);

    return await this.usersService.create(uuid);
  }

  public async resendEmailVerification(email: string): Promise<void> {
    await this.authClient.resendEmailVerification(email);
  }

  public async verifyEmail(email: string, token: string): Promise<UserTokens> {
    return await this.authClient.verifyEmail(email, token);
  }

  public async refresh(token: string): Promise<UserTokens> {
    return await this.authClient.refreshTokens(token);
  }
}
