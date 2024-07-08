export interface ApiKey {
  userId: number;
  token: string;
  iv: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface ApiKeyCreateParams {
  userId: number;
  token: string;
}
