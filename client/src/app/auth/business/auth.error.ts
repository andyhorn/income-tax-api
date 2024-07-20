import { HttpErrorResponse } from '@angular/common/http';

export class AuthError extends Error {
  constructor(code: string, message: string) {
    super(code);
    this.message = message;
  }

  public static fromErrorResponse(response: HttpErrorResponse): AuthError {
    switch (response.error.error) {
      case 'email-in-use':
        return new EmailInUseError();
      case 'invalid-credentials':
        return new InvalidCredentialsError();
      case 'email-not-confirmed':
        return new EmailNotConfirmedError();
      case 'invalid-token':
        return new InvalidTokenError();
      default:
        return new UnknownError();
    }
  }
}

export class UnknownError extends AuthError {
  constructor() {
    super('unknown', 'An unknown error occurred.');
  }
}

export class EmailInUseError extends AuthError {
  constructor() {
    super('email-in-use', 'A user already exists with the given email.');
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('invalid-credentials', 'The email or password are incorrect.');
  }
}

export class EmailNotConfirmedError extends AuthError {
  constructor() {
    super('email-not-confirmed', 'This email has not been confirmed.');
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('invalid-token', 'The token is invalid or has expired.');
  }
}
