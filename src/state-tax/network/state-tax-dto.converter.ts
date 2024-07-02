import { StateTax } from '../data/state-tax.interface';
import { StateTaxDto, StateTaxFilingStatusDto } from './state-tax.dto';

export class StateTaxDtoConverter {
  public toDto(stateTax: StateTax): StateTaxDto {
    return {
      filingStatus: StateTaxFilingStatusDto[stateTax.filingStatus],
      income: stateTax.income,
      rate: stateTax.rate,
      state: stateTax.state,
      year: stateTax.year,
      id: stateTax.id,
    };
  }
}
