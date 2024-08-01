export interface ApiKey {
  id: number;
  userId: number;
  token: string;
  nickname: string | null;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface ApiKeyCreateParams {
  userId: number;
  hash: string;
  nickname?: string;
}

export interface ApiKeyFindParams {
  token?: string;
}

export interface ApiKeyFindManyParams {
  userId?: number;
}
