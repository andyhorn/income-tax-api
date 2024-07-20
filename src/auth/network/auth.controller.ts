import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/users/network/user.dto';
import { AuthService } from '../business/auth.service';
import { UserTokens } from '../data/auth-data.interface';
import {
  RefreshTokensDto,
  ResendEmailVerificationDto,
  SignInDto,
  SignUpDto,
  UserTokensDto,
  VerifyEmailDto,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() { email, password }: SignInDto,
  ): Promise<UserTokens> {
    return this.authService.login({ email, password });
  }

  @Post('sign-up')
  public async signUp(
    @Body()
    { email, password, confirmPassword }: SignUpDto,
  ): Promise<UserDto> {
    if (password != confirmPassword) {
      throw new BadRequestException('Passwords must match');
    }

    const user = await this.authService.signUp({ email, password });
    return { uuid: user.uuid };
  }

  @Post('resend')
  public async resendEmailVerification(
    @Body() { email }: ResendEmailVerificationDto,
  ): Promise<void> {
    await this.authService.resendEmailVerification(email);
  }

  @Post('verify')
  public async verifyEmail(
    @Body() { email, token }: VerifyEmailDto,
  ): Promise<UserTokensDto> {
    const tokens = await this.authService.verifyEmail(email, token);

    return {
      access: tokens.access,
      refresh: tokens.refresh,
    };
  }

  @Post('refresh')
  public async refreshTokens(
    @Body() { token }: RefreshTokensDto,
  ): Promise<UserTokensDto> {
    const tokens = await this.authService.refresh(token);

    return {
      access: tokens.access,
      refresh: tokens.refresh,
    };
  }
}
