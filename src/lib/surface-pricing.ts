import { business } from '../data/business';

export type MinimumSurface = keyof typeof business.pricing.standalone;

/** Apply each surface's own minimum to an independently calculated amount.
 * Keep this independent of the appointment minimum, which is applied once later.
 */
export function applySurfaceMinimum(surface: MinimumSurface, calculatedAmount: number): number {
  if (!Number.isFinite(calculatedAmount) || calculatedAmount < 0) {
    throw new RangeError('Enter a finite, non-negative calculated amount.');
  }
  return Math.round((Math.max(calculatedAmount, business.pricing.standalone[surface]) + Number.EPSILON) * 100) / 100;
}

export function stepsPrice(count: number): number {
  if (!Number.isInteger(count) || count < 1) throw new RangeError('Enter a positive whole number of steps.');
  return count * business.pricing.perStep;
}
