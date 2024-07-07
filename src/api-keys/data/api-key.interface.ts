export interface ApiKey {
  userId: number;
  token: string;
  createdAt: Date;
  deletedAt: Date | null;
}
