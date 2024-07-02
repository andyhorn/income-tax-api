import { Injectable } from '@nestjs/common';
import { FederalTaxBracket } from '../business/federal-tax.interface';
import { DtoFilingStatus, FederalTaxBracketDto } from './federal-tax.dto';

@Injectable()
export class FederalTaxDtoConverter {
  public toDto(bracket: FederalTaxBracket): FederalTaxBracketDto {
    return {
      minimum: bracket.minimum,
      rate: bracket.tax,
      status: DtoFilingStatus[bracket.status],
      year: bracket.year,
      maximum: bracket.maximum,
    };
  }
}
