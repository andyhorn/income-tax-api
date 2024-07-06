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
      income: bracket.income,
      rate: bracket.tax,
      status: FederalTaxFilingStatusDto[bracket.status],
      year: bracket.year,
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
