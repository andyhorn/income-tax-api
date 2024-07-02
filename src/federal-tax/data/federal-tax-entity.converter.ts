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
      maximum: entity.maximum,
      minimum: entity.minimum,
      tax: entity.rate,
      status: FederalTaxFilingStatus[entity.rate],
      year: entity.year,
    };
  }

  public toEntity(bracket: FederalTaxBracket): FederalTaxBracketEntity {
    return {
      maximum: bracket.maximum,
      minimum: bracket.minimum,
      rate: bracket.tax,
      status: FederalTaxFilingStatusEntity[bracket.status],
      year: bracket.year,
      id: bracket.id,
    };
  }
}
