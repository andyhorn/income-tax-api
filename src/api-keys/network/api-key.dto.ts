export interface ApiKeyDto {
  id: number;
  nickname: string | null;
  createdAt: Date;
}

export interface KeyUsageDto {
  id: number;
  uses: Date[];
}
