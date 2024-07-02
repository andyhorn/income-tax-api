import { Module } from '@nestjs/common';
import { FederalTaxDataModule } from '../data/federal-tax-data.module';
import { FederalTaxService } from './federal-tax.service';
import { FederalTaxCsvParsingService } from './federal-tax-csv-parsing.service';

@Module({
  imports: [FederalTaxDataModule],
  providers: [FederalTaxService, FederalTaxCsvParsingService],
  exports: [FederalTaxService],
})
export class FederalTaxBusinessModule {}
