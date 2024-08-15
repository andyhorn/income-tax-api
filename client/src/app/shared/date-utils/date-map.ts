import { startOfDay } from './date-utils';

export class DateMap<T> {
  private readonly map = new Map<number, T>();

  public has(key: Date): boolean {
    return this.map.has(startOfDay(key).getTime());
  }

  public get(key: Date): T | undefined {
    return this.map.get(startOfDay(key).getTime());
  }

  public set(key: Date, value: T): void {
    this.map.set(startOfDay(key).getTime(), value);
  }
}
