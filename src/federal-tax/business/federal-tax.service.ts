import { Injectable } from '@nestjs/common';
import { FederalTaxRepository } from '../data/federal-tax.repository';
import {
  FederalTaxBracket,
  FederalTaxFilingStatus,
} from './federal-tax.interface';
import { FederalTaxCsvParsingService } from './federal-tax-csv-parsing.service';

export interface TaxBracketQuery {
  year?: number;
  status?: FederalTaxFilingStatus;
  income?: number;
}

@Injectable()
export class FederalTaxService {
  constructor(
    private readonly repository: FederalTaxRepository,
    private readonly csvParsingService: FederalTaxCsvParsingService,
  ) {}

  public async find(query: TaxBracketQuery): Promise<FederalTaxBracket[]> {
    return this.repository.find({
      income: query.income,
      status: query.status,
      year: query.year,
    });
  }

  public async saveFromCsv(
    csv: string,
    year: number,
  ): Promise<FederalTaxBracket[]> {
    const taxes = this.csvParsingService.parseCsv(csv, year);
    const ids = await this.repository.saveMany(taxes);

    return await this.repository.findManyById(ids);
  }
}
