import { BadRequestException } from '@nestjs/common';

export class EmailInUseError extends BadRequestException {
  constructor() {
    super('email-in-use', 'A user already exists with the given email.');
  }
}
