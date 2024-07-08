import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntityConverter } from './api-key-entity.converter';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKey, ApiKeyCreateParams } from './api-key.interface';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly repository: Repository<ApiKeyEntity>,
    private readonly converter: ApiKeyEntityConverter,
  ) {}

  public async list(): Promise<ApiKey[]> {
    const entities = await this.repository.find({});

    return entities.map(this.converter.fromEntity.bind(this));
  }

  public async find(key: string): Promise<ApiKey | null> {
    const entity = await this.repository.findOneBy({
      token: key,
    });

    if (!entity) {
      return null;
    }

    return this.converter.fromEntity(entity);
  }

  public async save({ userId, key, iv }: ApiKeyCreateParams): Promise<ApiKey> {
    const result = await this.repository.insert({
      token: key,
      userId,
      iv,
    });

    if (!result.identifiers.length) {
      throw new Error('Failed to save new API key!');
    }

    const entity = await this.repository.findOneBy({
      id: result.identifiers[0].id,
    });

    return this.converter.fromEntity(entity);
  }
}
