import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { StateTax, StateTaxFilingStatus } from '../data/state-tax.interface';

interface ParsedRow {
  state: string;
  singleRate: number;
  singleIncome: number;
  jointRate: number;
  jointIncome: number;
}

@Injectable()
export class StateTaxXlsParsingService {
  private readonly stateRegExp = new RegExp(/^([A-Za-z ,])+/);

  public async parse(xls: Buffer): Promise<StateTax[]> {
    const taxes: StateTax[] = [];
    const workbook = XLSX.read(xls);

    for (const name of workbook.SheetNames) {
      const worksheet = workbook.Sheets[name];
      const rows = <string[][]>(
        XLSX.utils
          .sheet_to_json(worksheet, { header: 1 })
          .filter((row: string[]) => row.length)
      );

      // remove the header rows
      rows.splice(0, 2);

      for (const row of rows) {
        const parsed = this.parseRow(row);
        const state = this.parseState(parsed.state);

        const single: StateTax = {
          filingStatus: StateTaxFilingStatus.SINGLE,
          income: parsed.singleIncome,
          rate: parsed.singleRate,
          state: state ?? taxes[taxes.length - 1].state,
          year: parseInt(name),
        };

        const joint: StateTax = {
          filingStatus: StateTaxFilingStatus.JOINT,
          income: parsed.jointIncome,
          rate: parsed.jointRate,
          state: state ?? taxes[taxes.length - 1].state,
          year: parseInt(name),
        };

        taxes.push(single);
        taxes.push(joint);
      }
    }

    return taxes;
  }

  private parseRow(row: (string | number)[]): ParsedRow {
    const [state, singleRate, _, singleIncome, jointRate, __, jointIncome] =
      row;

    return {
      state: (state ?? null) as string | null,
      singleIncome: this.parseIncome(singleIncome),
      jointIncome: this.parseIncome(jointIncome),
      jointRate: this.parseRate(jointRate),
      singleRate: this.parseRate(singleRate),
    };
  }

  private parseState(state: string | null): string | null {
    const matches = state?.match(this.stateRegExp);

    return matches?.[0].trim() ?? null;
  }

  private parseRate(rate: string | number | null): number {
    if (!rate || rate == 'none') {
      return 0;
    }

    return parseFloat(`${rate}`);
  }

  private parseIncome(income: string | number | null): number {
    if (!income || income == 'none') {
      return 0;
    }

    return parseFloat(`${income}`);
  }
}
