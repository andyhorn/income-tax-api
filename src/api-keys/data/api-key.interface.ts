export interface ApiKey {
  id: number;
  userId: number;
  hash: string;
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
  hash?: string;
}

export interface ApiKeyFindManyParams {
  userId?: number;
}

export interface ApiKeyDeleteParams {
  keyId: number;
  userId: number;
}
