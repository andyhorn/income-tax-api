import { Module } from '@nestjs/common';
import { StateTaxBusinessModule } from '../business/state-tax-business.module';
import { StateTaxDtoConverter } from './state-tax-dto.converter';
import { AuthModule } from 'src/auth/auth.module';
import { StateTaxController } from './state-tax.controller';

@Module({
  controllers: [StateTaxController],
  imports: [StateTaxBusinessModule, AuthModule],
  providers: [StateTaxDtoConverter],
})
export class StateTaxNetworkModule {}
