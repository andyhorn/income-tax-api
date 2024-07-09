export interface SignInDto {
  email: string;
  password: string;
}

export interface SignUpDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ResendEmailVerificationDto {
  email: string;
}

export interface VerifyEmailDto {
  email: string;
  token: string;
}

export interface UserTokensDto {
  access: string;
  refresh: string;
}
