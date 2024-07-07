export interface User {
  uuid: string;
  email: string;
  createdAt: Date;
  deletedAt: Date | null;
}
