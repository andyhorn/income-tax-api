import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FederalTaxBusinessModule } from '../business/federal-tax-business.module';
import { FederalTaxDtoConverter } from './federal-tax-dto.converter';
import { FederalTaxController } from './federal-tax.controller';

@Module({
  imports: [FederalTaxBusinessModule, AuthModule],
  controllers: [FederalTaxController],
  providers: [FederalTaxDtoConverter],
})
export class FederalTaxNetworkModule {}
