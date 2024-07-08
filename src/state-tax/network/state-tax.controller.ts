import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles, UserRoleGuard } from 'src/auth/user-role.guard';
import { MaybeParseIntPipe } from 'src/pipes/maybe-parse-int.pipe';
import { ApiKeyGuard } from 'src/shared/network/api-key.guard';
import { UserRole } from 'src/users/data/user.interface';
import { StateTaxService } from '../business/state-tax.service';
import { StateTaxDtoConverter } from './state-tax-dto.converter';
import { StateTaxDto, StateTaxFilingStatusDto } from './state-tax.dto';

@Controller('state')
export class StateTaxController {
  constructor(
    private readonly service: StateTaxService,
    private readonly converter: StateTaxDtoConverter,
  ) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  public async get(
    @Query('year', MaybeParseIntPipe) year?: number,
    @Query('status') filingStatus?: StateTaxFilingStatusDto,
    @Query('income', MaybeParseIntPipe) income?: number,
    @Query('state') state?: string,
  ): Promise<StateTaxDto[]> {
    const stateTaxes = await this.service.find({
      year,
      filingStatus: this.converter.maybeConvertFilingStatus(filingStatus),
      income,
      state,
    });

    return stateTaxes.map(this.converter.toDto);
  }

  @Get('source')
  public getSource(): { source: string } {
    return {
      source:
        'https://taxfoundation.org/data/all/state/state-income-tax-rates-2024/',
    };
  }

  @Post()
  @Roles([UserRole.ADMIN])
  @UseGuards(AuthGuard, UserRoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<StateTaxDto[]> {
    if (!file) {
      throw new BadRequestException('CSV file is required!');
    }

    const taxes = await this.service.saveFromCsv(file.buffer);

    return taxes.map(this.converter.toDto);
  }
}
