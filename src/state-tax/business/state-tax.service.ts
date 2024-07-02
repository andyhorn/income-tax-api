import { Injectable } from '@nestjs/common';
import { StateTax, StateTaxQuery } from '../data/state-tax.interface';
import { StateTaxRepository } from '../data/state-tax.repository';
import { StateTaxXlsParsingService } from './state-tax-xls-parsing.service';

@Injectable()
export class StateTaxService {
  constructor(
    private readonly repository: StateTaxRepository,
    private readonly csvParsingService: StateTaxXlsParsingService,
  ) {}

  public async find(query: StateTaxQuery): Promise<StateTax[]> {
    return this.repository.find(query);
  }

  public async saveFromCsv(csv: Buffer): Promise<StateTax[]> {
    const stateTaxes = await this.csvParsingService.parse(csv);

    if (!this.validate(stateTaxes)) {
      throw new Error('Failed to parse taxes');
    }

    try {
      const ids = await this.repository.saveMany(stateTaxes);
      return await this.repository.findManyById(ids);
    } catch (e) {
      throw e;
    }
  }

  private validate(taxes: StateTax[]): boolean {
    return taxes.every((tax) => {
      if (isNaN(tax.income)) {
        console.log('Income is NaN', tax);
        return false;
      }

      if (isNaN(tax.rate)) {
        console.log('Rate is NaN', tax);
        return false;
      }

      if (isNaN(tax.year)) {
        console.log('Year is NaN', tax);
        return false;
      }

      return true;
    });
  }
}
