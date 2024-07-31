import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiKeyEntityConverter } from './api-key-entity.converter';
import { ApiKeyEntity, ApiKeyUsageEntity } from './api-key.entity';
import {
  ApiKey,
  ApiKeyCreateParams,
  ApiKeyFindManyParams,
  ApiKeyFindParams,
} from './api-key.interface';

@Injectable()
export class ApiKeyRepository {
  constructor(
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeyRepository: Repository<ApiKeyEntity>,
    @InjectRepository(ApiKeyUsageEntity)
    private readonly apiKeyUsageRepository: Repository<ApiKeyUsageEntity>,
    private readonly converter: ApiKeyEntityConverter,
  ) {}

  public async list(): Promise<ApiKey[]> {
    const entities = await this.apiKeyRepository.find({});

    return entities.map(this.converter.fromEntity.bind(this));
  }

  public async findOne(params: ApiKeyFindParams): Promise<ApiKey | null> {
    const entity = await this.apiKeyRepository.findOneBy({
      ...params,
    });

    if (!entity) {
      return null;
    }

    return this.converter.fromEntity(entity);
  }

  public async findMany(params: ApiKeyFindManyParams): Promise<ApiKey[]> {
    const entities = await this.apiKeyRepository.findBy({
      ...params,
    });

    return entities.map(this.converter.fromEntity);
  }

  public async save({
    userId,
    hash,
    nickname,
  }: ApiKeyCreateParams): Promise<ApiKey> {
    const result = await this.apiKeyRepository.insert({
      token: hash,
      userId,
      nickname,
    });

    if (!result.identifiers.length) {
      throw new Error('Failed to save new API key!');
    }

    const entity = await this.apiKeyRepository.findOneBy({
      id: result.identifiers[0].id,
    });

    return this.converter.fromEntity(entity);
  }

  public async markUsed(token: string): Promise<ApiKey | null> {
    const entity = await this.apiKeyRepository.findOneBy({
      token,
    });

    if (!entity) {
      return null;
    }

    await this.apiKeyUsageRepository.insert({
      apiKeyId: entity.id,
    });

    return this.converter.fromEntity(entity);
  }
}
