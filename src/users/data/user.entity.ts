import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'uuid',
  })
  uuid: string;

  @Column()
  email: string;

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
