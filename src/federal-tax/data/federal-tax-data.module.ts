import { Module } from '@nestjs/common';
import { FederalTaxRepository } from './federal-tax.repository';
import { FederalTaxEntityConverter } from './federal-tax-entity.converter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FederalTaxBracketEntity } from './federal-tax.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FederalTaxBracketEntity])],
  providers: [FederalTaxRepository, FederalTaxEntityConverter],
  exports: [FederalTaxRepository],
})
export class FederalTaxDataModule {}
