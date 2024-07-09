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
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auth/network/auth.guard';
import { Role, UserRoleGuard } from 'src/auth/network/user-role.guard';
import { MaybeParseFilingStatusPipe } from 'src/pipes/maybe-parse-filing-status.pipe';
import { MaybeParseIntPipe } from 'src/pipes/maybe-parse-int.pipe';
import { ApiKeyGuard } from 'src/shared/network/api-key.guard';
import { UserRole } from 'src/users/data/user.interface';
import { FederalTaxService } from '../business/federal-tax.service';
import { FederalTaxDtoConverter } from './federal-tax-dto.converter';
import {
  FederalTaxBracketDto,
  FederalTaxFilingStatusDto,
} from './federal-tax.dto';

@Controller('federal')
export class FederalTaxController {
  constructor(
    private readonly federalTaxService: FederalTaxService,
    private readonly converter: FederalTaxDtoConverter,
  ) {}

  @Get()
  @UseGuards(ApiKeyGuard)
  public async find(
    @Query('year', MaybeParseIntPipe) year?: number,
    @Query('status', MaybeParseFilingStatusPipe)
    status?: FederalTaxFilingStatusDto,
    @Query('income', MaybeParseIntPipe) income?: number,
  ): Promise<FederalTaxBracketDto[]> {
    const brackets = await this.federalTaxService.find(
      this.converter.toQuery({
        income,
        status,
        year,
      }),
    );

    return brackets.map(this.converter.toDto);
  }

  @Get('source')
  public getSource(): { source: string } {
    return {
      source: 'https://taxfoundation.org/data/all/federal/2024-tax-brackets/',
    };
  }

  @Post(':year')
  @Role(UserRole.ADMIN)
  @UseGuards(AuthGuard, UserRoleGuard)
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
