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

/** Preparing this URL never sends a request; the customer sends it in their app. */
export function drivewayEstimateSms(squareFeet: number): string {
  const message = `Hi SELI Pressure Washing, I'd like a residential driveway estimate.\nDriveway size: ${squareFeet} sq. ft.\nIntroductory estimated price: ${formatDrivewayPrice(drivewayIntroductoryPrice(squareFeet))}\nFirst 10 residential customers; subject to inspection and confirmation. Additional surfaces and specialty stain treatments are quoted separately.\nAddress: \nPhotos: I'll attach them here.`;
  return `sms:${business.phone.e164}?&body=${encodeURIComponent(message)}`;
}
