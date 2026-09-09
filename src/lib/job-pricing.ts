import { business } from '../data/business';
import { drivewayIntroductoryPrice, formatDrivewayPrice } from './driveway-pricing';
import { applySurfaceMinimum, stepsPrice } from './surface-pricing';

export const calculatorServices = [
  { key: 'driveway', slug: 'driveways', name: 'Driveway', unit: 'sq. ft.', initial: 900 },
  { key: 'porch', slug: 'porches', name: 'Porch', unit: 'sq. ft.', initial: 100 },
  { key: 'sidewalk', slug: 'sidewalks-walkways', name: 'Sidewalk', unit: 'sq. ft.', initial: 100 },
  { key: 'patio', slug: 'patios-porches', name: 'Patio', unit: 'sq. ft.', initial: 100 },
  { key: 'steps', slug: 'steps-entry-pads', name: 'Steps', unit: 'steps', initial: 1 },
] as const;
export type CalculatorService = typeof calculatorServices[number]['key'];
export type Selection = { service: CalculatorService; quantity: number };
export type JobQuote = ReturnType<typeof calculateJob>;

export function calculateJob(selections: Selection[]) {
  if (!selections.length) throw new RangeError('Select at least one service.');
  if (new Set(selections.map(s => s.service)).size !== selections.length) throw new RangeError('Select each surface only once.');
  const lines = selections.map(({ service, quantity }) => {
    const definition = calculatorServices.find(item => item.key === service);
    if (!definition || !Number.isFinite(quantity) || quantity < 0) throw new RangeError('Enter a valid size for each selected surface.');
    let price: number;
    if (service === 'driveway') price = drivewayIntroductoryPrice(quantity);
    else if (service === 'steps') price = stepsPrice(quantity);
    else price = applySurfaceMinimum(service === 'patio' ? 'patioOrPoolDeck' : service, quantity * business.pricing.surfacePricePerSquareFoot[service]);
    if (!Number.isSafeInteger(Math.round(price * 100))) throw new RangeError('The entered size is too large to calculate reliably.');
    return { ...definition, quantity, price: Math.round((price + Number.EPSILON) * 100) / 100 };
  });
  const subtotalCents = lines.reduce((sum, line) => sum + Math.round(line.price * 100), 0);
  if (!Number.isSafeInteger(subtotalCents)) throw new RangeError('The combined size is too large to calculate reliably.');
  const totalCents = Math.max(business.pricing.jobMinimum * 100, subtotalCents);
  return { lines, subtotal: subtotalCents / 100, minimumAdjustment: (totalCents - subtotalCents) / 100, total: totalCents / 100 };
}

export function jobQuoteText(quote: JobQuote): string {
  return [
    ...quote.lines.map(line => `${line.name}: ${line.quantity.toLocaleString('en-US', { maximumFractionDigits: 6 })} ${line.unit} — ${formatDrivewayPrice(line.price)}`),
    `Service subtotal: ${formatDrivewayPrice(quote.subtotal)}`,
    `Appointment minimum adjustment: ${formatDrivewayPrice(quote.minimumAdjustment)}`,
    `Estimated job total: ${formatDrivewayPrice(quote.total)}`,
  ].join('\n');
}

export function jobEstimateMessage(quote: JobQuote): string {
  return `Hi ${business.name}, I'd like an estimate.\n${jobQuoteText(quote)}\n${quote.lines.some(line => line.key === 'driveway') ? `Driveway Introductory Pricing: first ${business.pricing.drivewayIntroductory.customerLimit} residential customers. ` : ''}$${business.pricing.jobMinimum} appointment minimum applied once to the combined services. Subject to inspection; specialty stain treatments and travel may cost extra.\nAddress: \nPhotos: I'll attach them here.`;
}

export function jobEstimateSms(quote: JobQuote): string {
  return `sms:${business.phone.e164}?&body=${encodeURIComponent(jobEstimateMessage(quote))}`;
}

/** The calculator and FAQ show examples calculated with the same job rules. */
export const jobExamples = [
  [{ service: 'porch', quantity: 100 }],
  [{ service: 'porch', quantity: 100 }, { service: 'sidewalk', quantity: 100 }],
  [{ service: 'patio', quantity: 500 }, { service: 'sidewalk', quantity: 100 }],
].map(selections => {
  const quote = calculateJob(selections as Selection[]);
  return {
    label: quote.lines.map(line => `${line.quantity} ${line.unit} ${line.name.toLowerCase()}`).join(' + '),
    calculation: `${quote.lines.map(line => formatDrivewayPrice(line.price)).join(' + ')}${quote.minimumAdjustment ? ` + ${formatDrivewayPrice(quote.minimumAdjustment)} appointment adjustment` : '; no adjustment'}`,
    quote,
  };
});
