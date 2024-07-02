import { Module } from '@nestjs/common';
import { StateTaxNetworkModule } from './network/state-tax-network.module';

@Module({
  imports: [StateTaxNetworkModule],
})
export class StateTaxModule {}
