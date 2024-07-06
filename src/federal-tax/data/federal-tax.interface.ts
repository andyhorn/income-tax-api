export interface FederalTaxBracket {
  id?: number;
  income: number;
  tax: number;
  status: FederalTaxFilingStatus;
  year: number;
}

export enum FederalTaxFilingStatus {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
  HEAD = 'HEAD',
}
