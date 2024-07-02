import { Module } from '@nestjs/common';
import { FederalTaxBusinessModule } from '../business/federal-tax-business.module';
import { FederalTaxController } from './federal-tax.controller';
import { FederalTaxDtoConverter } from './federal-tax-dto.converter';

@Module({
  imports: [FederalTaxBusinessModule],
  controllers: [FederalTaxController],
  providers: [FederalTaxDtoConverter],
})
export class FederalTaxNetworkModule {}
