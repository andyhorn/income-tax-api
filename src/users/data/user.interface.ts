export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  uuid: string;
  role: UserRole;
  createdAt: Date;
  deletedAt: Date | null;
}
