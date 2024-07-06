import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThanOrEqual, Repository } from 'typeorm';
import { FederalTaxEntityConverter } from './federal-tax-entity.converter';
import {
  FederalTaxBracketEntity,
  FederalTaxFilingStatusEntity,
} from './federal-tax.entity';
import {
  FederalTaxBracket,
  FederalTaxFilingStatus,
} from './federal-tax.interface';

export interface FederalTaxBracketQuery {
  year?: number;
  income?: number;
  status?: FederalTaxFilingStatus;
}

export class FederalTaxRepository {
  constructor(
    @InjectRepository(FederalTaxBracketEntity)
    private readonly repository: Repository<FederalTaxBracketEntity>,
    private readonly converter: FederalTaxEntityConverter,
  ) {}

  public async find(
    query?: FederalTaxBracketQuery,
  ): Promise<FederalTaxBracket[]> {
    const entities = await this.repository.findBy({
      year: query.year,
      income: query.income && MoreThanOrEqual(query.income),
      status: query.status && FederalTaxFilingStatusEntity[query.status],
    });

    return entities.map(this.converter.fromEntity);
  }

  public async findManyById(ids: number[]): Promise<FederalTaxBracket[]> {
    const entities = await this.repository.find({
      where: {
        id: In(ids),
      },
    });

    return entities.map(this.converter.fromEntity);
  }

  public async saveMany(taxes: FederalTaxBracket[]): Promise<number[]> {
    const result = await this.repository.insert(
      taxes.map(this.converter.toEntity),
    );
    return result.identifiers.map((el) => el['id']);
  }
}
