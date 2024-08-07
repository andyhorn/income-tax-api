import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { FederalTaxFilingStatus } from '../federal-tax/data/federal-tax.interface';

@Injectable()
export class MaybeParseFilingStatusPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value && FederalTaxFilingStatus[`${value}`.toUpperCase()];
  }
}
