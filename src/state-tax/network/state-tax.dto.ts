export enum StateTaxFilingStatusDto {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
}

export interface StateTaxDto {
  state: string;
  filingStatus: StateTaxFilingStatusDto;
  income: number;
  year: number;
  rate: number;
}
