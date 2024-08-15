import { Injectable } from '@angular/core';
import { ApiKey, ApiKeyDto } from './keys.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiKeyDtoConverter {
  public fromDto(dto: ApiKeyDto): ApiKey {
    return {
      ...dto,
      createdAt: new Date(dto.createdAt),
    };
  }
}
