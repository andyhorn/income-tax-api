export interface ApiKey {
  id: number;
  nickname: string;
  createdAt: Date;
}

export interface ApiKeyDto {
  id: number;
  nickname: string;
  createdAt: string;
}
