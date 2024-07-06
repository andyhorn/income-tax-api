import { Injectable } from '@nestjs/common';
import {
  FederalTaxBracketEntity,
  FederalTaxFilingStatusEntity,
} from './federal-tax.entity';
import {
  FederalTaxBracket,
  FederalTaxFilingStatus,
} from './federal-tax.interface';

@Injectable()
export class FederalTaxEntityConverter {
  public fromEntity(entity: FederalTaxBracketEntity): FederalTaxBracket {
    return {
      income: entity.income,
      tax: entity.rate,
      status: FederalTaxFilingStatus[entity.status],
      year: entity.year,
    };
  }

  public toEntity(bracket: FederalTaxBracket): FederalTaxBracketEntity {
    return {
      income: bracket.income,
      rate: bracket.tax,
      status: FederalTaxFilingStatusEntity[bracket.status],
      year: bracket.year,
      id: bracket.id,
    };
  }
}
