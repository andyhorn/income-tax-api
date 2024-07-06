import { Injectable } from '@nestjs/common';
import {
  FederalTaxBracket,
  FederalTaxFilingStatus,
} from '../data/federal-tax.interface';

interface ParsedRow {
  rate: string;
  singleRange: string;
  jointRange: string;
  headRange: string;
}

@Injectable()
export class FederalTaxCsvParsingService {
  private readonly dollarBeginRegExp = new RegExp(/^\$([\d,]+)/m);
  private readonly dollarEndRegExp = new RegExp(/^.*\$([\d,]+)$/m);

  public parseCsv(csv: string, year: number): FederalTaxBracket[] {
    const [_, ...rows] = csv.split('\n');

    const taxes: FederalTaxBracket[] = [];

    for (const row of rows) {
      const { rate, singleRange, jointRange, headRange } =
        this.parseRowElements(row);

      const parsedRate = this.parseRate(rate);
      const parsedSingleIncome = this.parseIncome(singleRange);
      const parsedJointIncome = this.parseIncome(jointRange);
      const parsedHeadIncome = this.parseIncome(headRange);

      const singleBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.SINGLE,
        income: parsedSingleIncome,
        tax: parsedRate,
      };

      const jointBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.JOINT,
        income: parsedJointIncome,
        tax: parsedRate,
      };

      const headBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.HEAD,
        income: parsedHeadIncome,
        tax: parsedRate,
      };

      taxes.push(singleBracket);
      taxes.push(jointBracket);
      taxes.push(headBracket);
    }

    return taxes;
  }

  private parseRowElements(row: string): ParsedRow {
    const [rate, singleRange, jointRange, headRange] = row
      .split(',"')
      .map((el) => el.replaceAll('"', ''));

    return {
      rate,
      singleRange,
      jointRange,
      headRange,
    };
  }

  private parseIncome(range: string): number {
    const incomeRangeStart = range.match(this.dollarBeginRegExp);
    return incomeRangeStart
      ? parseInt(incomeRangeStart[1].replaceAll(',', ''))
      : 0;
  }

  private parseRate(rate: string): number {
    return parseInt(rate.replaceAll('%', '')) / 100;
  }
}
