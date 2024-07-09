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

export class EmailNotConfirmedError extends UnauthorizedException {
  constructor() {
    super('email-not-confirmed', 'This email has not been confirmed.');
  }
}
