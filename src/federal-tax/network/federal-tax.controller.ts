import {
  BadRequestException,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MaybeParseIntPipe } from 'src/pipes/maybe-parse-int.pipe';
import { FederalTaxFilingStatus } from '../data/federal-tax.interface';
import { FederalTaxService } from '../business/federal-tax.service';
import { FederalTaxDtoConverter } from './federal-tax-dto.converter';
import { DtoFilingStatus, FederalTaxBracketDto } from './federal-tax.dto';
import { MaybeParseFilingStatusPipe } from 'src/pipes/maybe-parse-filing-status.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('federal')
export class FederalTaxController {
  constructor(
    private readonly federalTaxService: FederalTaxService,
    private readonly converter: FederalTaxDtoConverter,
  ) {}

  @Get()
  public async find(
    @Query('year', MaybeParseIntPipe) year?: number,
    @Query('status', MaybeParseFilingStatusPipe) status?: DtoFilingStatus,
    @Query('income', MaybeParseIntPipe) income?: number,
  ): Promise<FederalTaxBracketDto[]> {
    const brackets = await this.federalTaxService.find({
      year,
      income,
      status: status && FederalTaxFilingStatus[status],
    });

    return brackets.map(this.converter.toDto);
  }

  @Get('source')
  public getSource(): { source: string } {
    return {
      source: 'https://taxfoundation.org/data/all/federal/2024-tax-brackets/',
    };
  }

  @Post(':year')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @UploadedFile() file: Express.Multer.File,
    @Param('year', ParseIntPipe) year: number,
  ): Promise<FederalTaxBracketDto[]> {
    if (!file || !file.originalname.endsWith('.csv')) {
      throw new BadRequestException('CSV file is required!');
    }

    const taxes = await this.federalTaxService.saveFromCsv(
      file.buffer.toString(),
      year,
    );
    return taxes.map(this.converter.toDto);
  }
}
