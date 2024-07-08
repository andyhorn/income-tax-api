import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { FederalTaxBusinessModule } from '../business/federal-tax-business.module';
import { FederalTaxDtoConverter } from './federal-tax-dto.converter';
import { FederalTaxController } from './federal-tax.controller';
import { ApiKeysBusinessModule } from 'src/api-keys/business/api-keys-business.module';

@Module({
  imports: [FederalTaxBusinessModule, AuthModule, ApiKeysBusinessModule],
  controllers: [FederalTaxController],
  providers: [FederalTaxDtoConverter],
})
export class FederalTaxNetworkModule {}
