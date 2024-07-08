export interface User {
  id: number;
  uuid: string;
  createdAt: Date;
  deletedAt: Date | null;
}
