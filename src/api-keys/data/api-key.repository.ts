import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { ApiKeyEntityConverter } from './api-key-entity.converter';
import { ApiKeyEntity, ApiKeyUsageEntity } from './api-key.entity';
import {
  ApiKey,
  ApiKeyCreateParams,
  ApiKeyDeleteParams,
  ApiKeyFindManyParams,
  ApiKeyFindParams,
  ApiKeyUsageParams,
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
      deletedAt: IsNull(),
    });

    if (!entity) {
      return null;
    }

    return this.converter.fromEntity(entity);
  }

  public async findMany(params: ApiKeyFindManyParams): Promise<ApiKey[]> {
    const entities = await this.apiKeyRepository.findBy({
      ...params,
      deletedAt: IsNull(),
    });

    return entities.map(this.converter.fromEntity);
  }

  public async save({
    userId,
    hash,
    nickname,
  }: ApiKeyCreateParams): Promise<ApiKey> {
    const result = await this.apiKeyRepository.insert({
      hash: hash,
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
      hash: token,
    });

    if (!entity) {
      return null;
    }

    await this.apiKeyUsageRepository.insert({
      apiKeyId: entity.id,
    });

    return this.converter.fromEntity(entity);
  }

  public async delete({ keyId, userId }: ApiKeyDeleteParams): Promise<void> {
    const entity = await this.apiKeyRepository.findOneBy({
      userId,
      id: keyId,
    });

    if (!entity) {
      throw new NotFoundException();
    }

    entity.deletedAt = new Date();

    await this.apiKeyRepository.update(
      {
        id: keyId,
      },
      {
        deletedAt: new Date(),
      },
    );
  }

  public async exists(token: string): Promise<boolean> {
    const entity = await this.apiKeyRepository.findOne({
      where: {
        hash: token,
      },
    });

    return entity != null;
  }

  public async getUsage({ keyId, userId }: ApiKeyUsageParams): Promise<Date[]> {
    const entities = await this.apiKeyUsageRepository.find({
      where: {
        apiKey: {
          userId,
          id: keyId,
        },
      },
    });

    return entities.map((entity) => entity.usedAt);
  }
}
