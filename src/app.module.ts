import { Module } from '@nestjs/common';
import { FederalTaxModule } from './federal-tax/federal-tax.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaybeParseIntPipe } from './pipes/maybe-parse-int.pipe';
import { MaybeParseFilingStatusPipe } from './pipes/maybe-parse-filing-status.pipe';
import { StateTaxModule } from './state-tax/state-tax.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    FederalTaxModule,
    StateTaxModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST') ?? 'localhost',
          port: config.get<number>('DB_PORT') ?? 54322,
          username: config.get<string>('DB_USER') ?? 'postgres',
          password: config.get<string>('DB_PASSWORD') ?? 'postgres',
          database: config.get<string>('DB_NAME') ?? 'postgres',
          autoLoadEntities: true,
        };
      },
    }),
  ],
  controllers: [],
  providers: [MaybeParseIntPipe, MaybeParseFilingStatusPipe],
  exports: [ConfigModule],
})
export class AppModule {}
