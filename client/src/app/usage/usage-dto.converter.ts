import { Injectable } from '@angular/core';
import { KeyUsage, KeyUsageDto } from './usage.interface';

@Injectable({
  providedIn: 'root',
})
export class KeyUsageDtoConverter {
  public fromDto(dto: KeyUsageDto): KeyUsage {
    return {
      ...dto,
      uses: dto.uses.map((usageStr) => new Date(usageStr)),
    };
  }
}
