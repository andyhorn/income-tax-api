import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class EmailInUseError extends BadRequestException {
  constructor() {
    super('email-in-use', 'A user already exists with the given email.');
  }
}

export class InvalidCredentialsError extends UnauthorizedException {
  constructor() {
    super('invalid-credentials', 'The email or password are incorrect.');
  }
}
