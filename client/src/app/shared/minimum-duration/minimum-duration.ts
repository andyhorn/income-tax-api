import { delayWhen, OperatorFunction, timer } from 'rxjs';

/**
 * Add an artificial delay so that the operation takes at least {{duration}} ms.
 * @param duration The minimum elapsed time in ms. Defaults to 500.
 */
export function minimumDuration(
  duration: number = 500,
): OperatorFunction<any, any> {
  const start = Date.now();

  return delayWhen(() => timer(start + duration - Date.now()));
}
