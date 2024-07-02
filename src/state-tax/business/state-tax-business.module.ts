import { Module } from '@nestjs/common';
import { StateTaxDataModule } from '../data/state-tax-data.module';
import { StateTaxService } from './state-tax.service';
import { StateTaxXlsParsingService } from './state-tax-xls-parsing.service';

@Module({
  imports: [StateTaxDataModule],
  providers: [StateTaxService, StateTaxXlsParsingService],
  exports: [StateTaxService],
})
export class StateTaxBusinessModule {}
