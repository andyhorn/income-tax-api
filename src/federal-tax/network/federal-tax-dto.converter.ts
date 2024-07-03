import { Injectable } from '@nestjs/common';
import {
  FederalTaxBracket,
  FederalTaxFilingStatus,
} from '../data/federal-tax.interface';
import {
  FederalTaxFilingStatusDto,
  FederalTaxBracketDto,
  FederalTaxBracketQueryDto,
} from './federal-tax.dto';
import { TaxBracketQuery } from '../business/federal-tax.service';

@Injectable()
export class FederalTaxDtoConverter {
  public toDto(bracket: FederalTaxBracket): FederalTaxBracketDto {
    return {
      minimum: bracket.minimum,
      rate: bracket.tax,
      status: FederalTaxFilingStatusDto[bracket.status],
      year: bracket.year,
      maximum: bracket.maximum,
    };
  }

  public toQuery(dto: FederalTaxBracketQueryDto): TaxBracketQuery {
    return {
      income: dto.income,
      status: dto.status && FederalTaxFilingStatus[dto.status],
      year: dto.year,
    };
  }
}
