/**
 * Services and prices exactly as documented in BUSINESS_INPUTS.md.
 *
 * Do not add a service that is not listed here, and do not soften anything in
 * `notOffered` into a maybe. Unusual surfaces are evaluated first and may be
 * declined — that is the honest position and it stays.
 */

import { business, drivewayBaseSummary, drivewayOfferSummary, surfacePricingNote } from './business';
const pricing = business.pricing;
export type Service = {
  slug: string;
  name: string;
  /** What the work covers. No guarantees, no stain-removal promises. */
  blurb: string;
  /** Rendered price line. */
  price: string;
  /** Optional second line under the price. */
  priceNote?: string;
  /** Core launch service, or custom-quote only. */
  tier: 'core' | 'custom';
  /** Longer copy for the Services page. */
  detail: string;
};

export const services: Service[] = [
  {
    slug: 'driveways',
    name: 'Driveways',
    blurb:
      'Concrete cleaning that lifts general soiling, weathering, and the green film that creeps in along shaded edges.',
    price: drivewayBaseSummary,
    priceNote: drivewayOfferSummary,
    tier: 'core',
    detail:
      'The largest flat surface on most properties and the one that ages a house fastest. We work the full slab, including the darker bands along shaded edges where growth takes hold first. Concrete only — we do not clean pavers or brick.',
  },
  {
    slug: 'sidewalks-walkways',
    name: 'Sidewalks & walkways',
    blurb:
      'The concrete guests actually walk on. Joints, edges, and the darker band where the lawn meets the path.',
    price: `$${pricing.standalone.sidewalk} minimum per sidewalk`,
    priceNote: surfacePricingNote('sidewalk'),
    tier: 'core',
    detail:
      'Front paths, side walks, and the run out to the street. These pick up growth along the edges where the lawn overlaps the concrete, which is usually what makes a tidy property look neglected.',
  },
  {
    slug: 'patios-porches',
    name: 'Patios',
    blurb:
      'Lower pressure on standard poured and broom-finish concrete, kept clear of planting beds and furniture.',
    price: `$${pricing.standalone.patioOrPoolDeck} minimum per patio`,
    priceNote: surfacePricingNote('patio'),
    tier: 'core',
    detail:
      'Standard poured and broom-finish concrete, cleaned at lower pressure and kept away from planting beds. We do not work on decorative, painted, coated, sealed, or stamped surfaces — those need a different approach than we currently offer.',
  },
  {
    slug: 'porches',
    name: 'Porches',
    blurb: 'A fresh approach to your front door, with care around edges and planting beds.',
    price: `$${pricing.standalone.porch} minimum per porch`,
    priceNote: surfacePricingNote('porch'),
    tier: 'core',
    detail: 'Cleaning for ordinary concrete porches. Access, finish, and staining are checked before we agree on the work.',
  },
  {
    slug: 'steps-entry-pads',
    name: 'Steps',
    blurb:
      `Small areas that carry the most traffic and show it first. Each step is $${pricing.perStep}, whether booked alone or with another surface.`,
    price: `$${pricing.perStep} per step`,
    priceNote:
      `Each step is priced individually. The combined appointment has a $${pricing.jobMinimum} minimum. Entry pads and additional surfaces are quoted separately.`,
    tier: 'core',
    detail:
      `Concrete steps take the most foot traffic on a property. Pricing is $${pricing.perStep} per step; tell us how many you would like cleaned.`,
  },
  {
    slug: 'pool-decks',
    name: 'Pool decks',
    blurb: 'Cleaning for ordinary concrete around your pool, assessed before work begins.',
    price: `$${pricing.standalone.patioOrPoolDeck} surface minimum`,
    priceNote: `Quoted after inspection. The combined appointment has a $${pricing.jobMinimum} minimum.`,
    tier: 'core',
    detail: 'Ordinary concrete pool decks only. Size, access, and the surface finish are assessed before we confirm a price; decorative or coated surfaces are not offered.',
  },
  {
    slug: 'parking-pads-aprons',
    name: 'Parking pads & aprons',
    blurb:
      'Concrete parking areas at small commercial properties, scheduled outside your business hours.',
    price: 'Quoted per site',
    tier: 'custom',
    detail:
      'Concrete parking pads and entry aprons at small commercial properties. Every site is different, so these are quoted after a look rather than from a starting price. Work can be scheduled outside your business hours.',
  },
  {
    slug: 'recurring-property-care',
    name: 'Recurring property care',
    blurb:
      'Set intervals for property managers, with one point of contact and the same walkthrough every visit.',
    price: 'Quoted per property',
    tier: 'custom',
    detail:
      'For property managers who would rather not think about it. Set intervals, one point of contact, and the same walkthrough each visit. Quoted per property once the surfaces and frequency are known.',
  },
];

export const coreServices = services.filter((s) => s.tier === 'core');
export const customQuoteServices = services.filter((s) => s.tier === 'custom');

/**
 * Explicitly not offered at launch. Listed on the site because saying so
 * up front saves everyone a wasted conversation.
 */
export const notOffered: string[] = [
  'Roof washing',
  'House or siding soft washing',
  'Gutters',
  'Fences and decks',
  'Sealing and joint-sand replacement',
  'Concrete restoration',
  'Pavers and brick',
  'Decorative, painted, coated, sealed, stamped, or otherwise fragile surfaces',
];

/**
 * Stains we do not promise to remove. Specialty-treatment policy is TBD, so the
 * site states the limit and stops there.
 */
export const notGuaranteed =
  'Oil, rust, paint, oxidation, and severe staining require inspection and may cost extra. Additional surfaces and specialty stain treatments are quoted separately. No stain removal is guaranteed; expected results are discussed before work starts.';
