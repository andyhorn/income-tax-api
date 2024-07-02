import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class MaybeParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): number | undefined {
    return value && parseInt(value);
  }
}
