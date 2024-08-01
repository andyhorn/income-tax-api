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

  @Column({
    name: 'nickname',
    nullable: true,
  })
  nickname: string | null;

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
  hash: string;

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

@Entity('api_key_usage')
export class ApiKeyUsageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ApiKeyEntity)
  @JoinColumn({
    name: 'api_key_id',
  })
  apiKey: ApiKeyEntity;

  @Column({
    name: 'api_key_id',
  })
  apiKeyId: number;

  @Column({
    type: 'timestamptz',
    name: 'used_at',
  })
  usedAt: Date;
}
