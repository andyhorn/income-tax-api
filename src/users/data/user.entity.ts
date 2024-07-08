import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRolesEntity {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
  })
  uuid: string;

  @Column({
    type: 'enum',
    enumName: 'user_roles',
    enum: UserRolesEntity,
  })
  role: UserRolesEntity;

  @Column({
    name: 'created_at',
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
  })
  deletedAt: Date;
}
