import { Module } from '@nestjs/common';
import { StateTaxBusinessModule } from '../business/state-tax-business.module';
import { StateTaxDtoConverter } from './state-tax-dto.converter';
import { StateTaxController } from './state-tax.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [StateTaxController],
  imports: [StateTaxBusinessModule, AuthModule],
  providers: [StateTaxDtoConverter],
})
export class StateTaxNetworkModule {}
