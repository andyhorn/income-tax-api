export interface ApiKey {
  id: number;
  nickname: string;
  createdAt: Date;
}

export interface ApiKeyCreationResult extends ApiKey {
  key: string;
}
