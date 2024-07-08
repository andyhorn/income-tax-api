import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiKeyNetworkModule } from './api-keys/network/api-key-network.module';
import { AuthModule } from './auth/auth.module';
import { FederalTaxModule } from './federal-tax/federal-tax.module';
import { MaybeParseFilingStatusPipe } from './pipes/maybe-parse-filing-status.pipe';
import { MaybeParseIntPipe } from './pipes/maybe-parse-int.pipe';
import { StateTaxModule } from './state-tax/state-tax.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    FederalTaxModule,
    StateTaxModule,
    ApiKeyNetworkModule,
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
