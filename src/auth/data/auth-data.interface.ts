export interface LoginParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
}

export interface SignUpResult {
  uuid: string;
}

export interface UserTokens {
  access: string;
  refresh: string;
}
