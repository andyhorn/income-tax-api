import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateTaxEntity } from './state-tax.entity';
import { StateTaxRepository } from './state-tax.repository';
import { StateTaxEntityConverter } from './state-tax-entity.converter';

@Module({
  imports: [TypeOrmModule.forFeature([StateTaxEntity])],
  providers: [StateTaxRepository, StateTaxEntityConverter],
  exports: [StateTaxRepository],
})
export class StateTaxDataModule {}
