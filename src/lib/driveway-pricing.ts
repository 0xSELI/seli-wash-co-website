import { business } from '../data/business';

const introductory = business.pricing.drivewayIntroductory;

/** Owner-confirmed introductory residential driveway pricing. */
export function drivewayIntroductoryPrice(squareFeet: number): number {
  const area = Number.isFinite(squareFeet) ? Math.max(0, squareFeet) : 0;
  const additionalSquareFeet = Math.max(0, area - introductory.includedSquareFeet);

  return introductory.basePrice + additionalSquareFeet * introductory.additionalPricePerSquareFoot;
}

export function formatDrivewayPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
