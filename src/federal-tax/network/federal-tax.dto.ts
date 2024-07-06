export enum FederalTaxFilingStatusDto {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
  HEAD = 'HEAD',
}

export interface FederalTaxBracketDto {
  rate: number;
  income: number;
  status: FederalTaxFilingStatusDto;
  year: number;
}

export interface FederalTaxBracketQueryDto {
  year?: number;
  status?: FederalTaxFilingStatusDto;
  income?: number;
}
