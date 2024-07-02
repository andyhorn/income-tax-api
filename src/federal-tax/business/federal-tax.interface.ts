export interface FederalTaxBracket {
  id?: number;
  minimum: number;
  maximum: number | null;
  tax: number;
  status: FederalTaxFilingStatus;
  year: number;
}

export enum FederalTaxFilingStatus {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
  HEAD = 'HEAD',
}
