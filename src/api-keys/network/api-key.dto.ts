export interface ApiKeyDto {
  nickname: string | null;
  createdAt: Date;
}

export interface ApiKeyCreationResultDto extends ApiKeyDto {
  key: string;
}
