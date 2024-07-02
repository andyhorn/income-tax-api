import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, ILike, LessThanOrEqual } from 'typeorm';
import { StateTaxFilingStatusEntity, StateTaxEntity } from './state-tax.entity';
import {
  StateTax,
  StateTaxFilingStatus,
  StateTaxQuery,
} from './state-tax.interface';

@Injectable()
export class StateTaxEntityConverter {
  public fromEntity(entity: StateTaxEntity): StateTax {
    return {
      filingStatus: StateTaxFilingStatus[entity.filingStatus],
      id: entity.id,
      income: entity.income,
      rate: entity.rate,
      state: entity.state,
      year: entity.year,
    };
  }

  public toEntity(stateTax: StateTax): StateTaxEntity {
    return {
      filingStatus: StateTaxFilingStatusEntity[stateTax.filingStatus],
      income: stateTax.income,
      rate: stateTax.rate,
      state: stateTax.state,
      id: stateTax.id,
      year: stateTax.year,
    };
  }

  public toQuery(query: StateTaxQuery): FindOptionsWhere<StateTaxEntity> {
    return {
      filingStatus: this.maybeParseFilingStatus(query.filingStatus),
      income: query.income && LessThanOrEqual(query.income),
      state: query.state && ILike(`%${query.state}%`),
      year: query.year,
    };
  }

  private maybeParseFilingStatus(
    status?: StateTaxFilingStatus,
  ): StateTaxFilingStatusEntity | undefined {
    return status && StateTaxFilingStatusEntity[status];
  }
}
