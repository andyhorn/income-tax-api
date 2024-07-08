import { UserEntity } from 'src/users/data/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('api_keys')
export class ApiKeyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'user_id',
  })
  user: UserEntity;

  @Column({
    name: 'user_id',
  })
  userId: number;

  @Column()
  token: string;

  @Column()
  iv: string;

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
