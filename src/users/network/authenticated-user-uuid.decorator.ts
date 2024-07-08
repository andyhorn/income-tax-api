import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';

export const AuthenticatedUserUuid = createParamDecorator<
  any,
  ExecutionContext,
  string
>((_, context) => {
  const req: Request = context.switchToHttp().getRequest();
  const uuid = req['user'];

  if (!uuid) {
    throw new UnauthorizedException();
  }

  return uuid;
});
