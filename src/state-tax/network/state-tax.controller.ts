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
import { MaybeParseIntPipe } from 'src/pipes/maybe-parse-int.pipe';
import { StateTaxService } from '../business/state-tax.service';
import { StateTaxFilingStatus } from '../data/state-tax.interface';
import { StateTaxDtoConverter } from './state-tax-dto.converter';
import { StateTaxDto, StateTaxFilingStatusDto } from './state-tax.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('state')
export class StateTaxController {
  constructor(
    private readonly service: StateTaxService,
    private readonly converter: StateTaxDtoConverter,
  ) {}

  @Get()
  public async get(
    @Query('year', MaybeParseIntPipe) year?: number,
    @Query('status') filingStatus?: StateTaxFilingStatusDto,
    @Query('income', MaybeParseIntPipe) income?: number,
    @Query('state') state?: string,
  ): Promise<StateTaxDto[]> {
    const stateTaxes = await this.service.find({
      year,
      filingStatus: filingStatus && StateTaxFilingStatus[filingStatus],
      income,
      state,
    });

    return stateTaxes.map(this.converter.toDto);
  }

  @Post()
  @UseGuards(AuthGuard)
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
