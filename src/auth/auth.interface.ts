export interface SignInParams {
  email: string;
  password: string;
}

export interface UserTokens {
  access: string;
  refresh: string;
}
