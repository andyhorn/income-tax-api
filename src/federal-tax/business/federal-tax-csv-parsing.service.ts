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
      const { rate, singleRange, jointRange, headRange } = this.parseRow(row);

      const parsedRate = this.parseRate(rate);
      const parsedSingleRange = this.parseIncomeRange(singleRange);
      const parsedJointRange = this.parseIncomeRange(jointRange);
      const parsedHeadRange = this.parseIncomeRange(headRange);

      const singleBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.SINGLE,
        minimum: parsedSingleRange.min,
        maximum: parsedSingleRange.max,
        tax: parsedRate,
      };

      const jointBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.JOINT,
        minimum: parsedJointRange.min,
        maximum: parsedJointRange.max,
        tax: parsedRate,
      };

      const headBracket: FederalTaxBracket = {
        year,
        status: FederalTaxFilingStatus.HEAD,
        minimum: parsedHeadRange.min,
        maximum: parsedHeadRange.max,
        tax: parsedRate,
      };

      taxes.push(singleBracket);
      taxes.push(jointBracket);
      taxes.push(headBracket);
    }

    return taxes;
  }

  private parseRow(row: string): ParsedRow {
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

  private parseIncomeRange(range: string): { min: number; max: number | null } {
    const minMatch = range.match(this.dollarBeginRegExp);
    const maxMatch = range.match(this.dollarEndRegExp);

    const min = minMatch ? parseInt(minMatch[1].replaceAll(',', '')) : 0;
    const max = maxMatch ? parseInt(maxMatch[1].replaceAll(',', '')) : null;

    return { min, max };
  }

  private parseRate(rate: string): number {
    return parseInt(rate.replaceAll('%', '')) / 100;
  }
}
