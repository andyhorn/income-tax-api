export interface ApiKey {
  userId: number;
  token: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface ApiKeyCreateParams {
  userId: number;
  hash: string;
}
