import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { UserTokens } from './auth.interface';
import { AuthService } from './auth.service';

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
  ): Promise<UserTokens> {
    if (password != confirmPassword) {
      throw new BadRequestException('Passwords must match');
    }

    return await this.authService.create({ email, password });
  }
}
