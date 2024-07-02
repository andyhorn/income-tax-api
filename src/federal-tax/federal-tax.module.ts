import { Module } from '@nestjs/common';
import { FederalTaxNetworkModule } from './network/federal-tax-network.module';

@Module({
  imports: [FederalTaxNetworkModule],
})
export class FederalTaxModule {}
