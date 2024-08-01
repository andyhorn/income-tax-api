export interface ApiKeyDto {
  id: number;
  nickname: string | null;
  createdAt: Date;
}

export interface ApiKeyCreationResultDto extends ApiKeyDto {
  key: string;
}
