import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { StateTaxEntityConverter } from './state-tax-entity.converter';
import { StateTaxEntity } from './state-tax.entity';
import { StateTax, StateTaxQuery } from './state-tax.interface';

@Injectable()
export class StateTaxRepository {
  constructor(
    @InjectRepository(StateTaxEntity)
    private readonly repository: Repository<StateTaxEntity>,
    private readonly converter: StateTaxEntityConverter,
  ) {}

  public async find(query: StateTaxQuery): Promise<StateTax[]> {
    const entities = await this.repository.find({
      where: this.converter.toQuery(query),
    });

    return entities.map(this.converter.fromEntity);
  }

  public async saveMany(taxes: StateTax[]): Promise<number[]> {
    const entities = await this.repository.insert(
      taxes.map(this.converter.toEntity),
    );

    return entities.identifiers.map((obj) => obj['id']);
  }

  public async findManyById(ids: number[]): Promise<StateTax[]> {
    const entities = await this.repository.findBy({
      id: In(ids),
    });

    return entities.map(this.converter.fromEntity);
  }
}
