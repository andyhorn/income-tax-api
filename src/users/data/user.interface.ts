export interface User {
  id: number;
  uuid: string;
  email: string;
  createdAt: Date;
  deletedAt: Date | null;
}
