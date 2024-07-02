export enum DtoFilingStatus {
  SINGLE = 'SINGLE',
  JOINT = 'JOINT',
  HEAD = 'HEAD',
}

export interface FederalTaxBracketDto {
  rate: number;
  minimum: number;
  maximum?: number;
  status: DtoFilingStatus;
  year: number;
}
