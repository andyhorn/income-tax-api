export interface ApiKey {
  nickname: string;
  createdAt: Date;
}

export interface ApiKeyCreationResult extends ApiKey {
  key: string;
}
