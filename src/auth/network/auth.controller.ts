import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { UserDto } from 'src/users/network/user.dto';
import { AuthService } from '../business/auth.service';
import { UserTokens } from '../data/auth-data.interface';
import { ResendEmailVerificationDto, SignInDto, SignUpDto } from './auth.dto';

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
}
