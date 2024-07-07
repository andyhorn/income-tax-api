import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntityConverter } from './api-key-entity.converter';
import { ApiKeyEntity } from './api-key.entity';
import { ApiKey } from './api-key.interface';

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
}
