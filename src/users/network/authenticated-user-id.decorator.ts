import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { USER_ID_REQUEST_KEY } from 'src/auth/network/auth.guard';

export const AuthenticatedUserId = createParamDecorator<
  any,
  ExecutionContext,
  number
>((_, context) => {
  const req: Request = context.switchToHttp().getRequest();
  const userId = req[USER_ID_REQUEST_KEY];

  if (!userId) {
    throw new UnauthorizedException();
  }

  return userId;
});
