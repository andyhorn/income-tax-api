export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function plusOneDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

export function areSameDate(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() == startOfDay(b).getTime();
}

export function lessThan(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}
