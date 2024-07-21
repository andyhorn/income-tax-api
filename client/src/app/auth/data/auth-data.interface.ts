export interface AuthDataRegisterDto {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthRegisterParameters extends AuthDataRegisterDto {}

export interface AuthDataLoginDto {
  email: string;
  password: string;
}

export interface AuthLoginParameters extends AuthDataLoginDto {}

export interface AuthUserTokens {
  access: string;
  refresh: string;
}

export interface AuthResendCodeDto {
  email: string;
}

export interface AuthResendCodeParameters extends AuthResendCodeDto {}
