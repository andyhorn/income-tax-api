export enum StateTaxFilingStatus {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
}

export interface StateTax {
  id?: number;
  state: string;
  filingStatus: StateTaxFilingStatus;
  income: number;
  rate: number;
  year: number;
}

export interface StateTaxQuery {
  state?: string;
  income?: number;
  filingStatus?: StateTaxFilingStatus;
  year?: number;
}
