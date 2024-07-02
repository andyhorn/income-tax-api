import { Module } from '@nestjs/common';
import { FederalTaxModule } from './federal-tax/federal-tax.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaybeParseIntPipe } from './pipes/maybe-parse-int.pipe';
import { MaybeParseFilingStatusPipe } from './pipes/maybe-parse-filing-status.pipe';
import { StateTaxModule } from './state-tax/state-tax.module';

@Module({
  imports: [
    FederalTaxModule,
    StateTaxModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 54322,
      username: 'postgres',
      password: 'postgres',
      database: 'postgres',
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [MaybeParseIntPipe, MaybeParseFilingStatusPipe],
})
export class AppModule {}
