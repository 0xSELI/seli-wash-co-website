/**
 * Services and prices exactly as documented in BUSINESS_INPUTS.md.
 *
 * Do not add a service that is not listed here, and do not soften anything in
 * `notOffered` into a maybe. Unusual surfaces are evaluated first and may be
 * declined — that is the honest position and it stays.
 */

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
    price: 'From $100',
    tier: 'core',
    detail:
      'The largest flat surface on most properties and the one that ages a house fastest. We work the full slab, including the darker bands along shaded edges where growth takes hold first. Concrete only — we do not clean pavers or brick.',
  },
  {
    slug: 'sidewalks-walkways',
    name: 'Sidewalks & walkways',
    blurb:
      'The concrete guests actually walk on. Joints, edges, and the darker band where the lawn meets the path.',
    price: 'From $50',
    tier: 'core',
    detail:
      'Front paths, side walks, and the run out to the street. These pick up growth along the edges where the lawn overlaps the concrete, which is usually what makes a tidy property look neglected.',
  },
  {
    slug: 'patios-porches',
    name: 'Patios & porches',
    blurb:
      'Lower pressure on standard poured and broom-finish concrete, kept clear of planting beds and furniture.',
    price: 'From $80',
    tier: 'core',
    detail:
      'Standard poured and broom-finish concrete, cleaned at lower pressure and kept away from planting beds. We do not work on decorative, painted, coated, sealed, or stamped surfaces — those need a different approach than we currently offer.',
  },
  {
    slug: 'steps-entry-pads',
    name: 'Steps & entry pads',
    blurb:
      'Small areas that carry the most traffic and show it first. Added to another service on the same visit, steps are $10 each.',
    price: '$10 per step',
    priceNote:
      'Booked on their own, a flight of fewer than five steps still comes to the $50 standalone minimum.',
    tier: 'core',
    detail:
      'Steps and entry pads take the most foot traffic on a property and show wear before anything else. Cheapest to add to a driveway or walkway visit; booked alone they are still subject to the $50 standalone minimum.',
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
  'Pool decks',
  'Decorative, painted, coated, sealed, stamped, or otherwise fragile surfaces',
];

/**
 * Stains we do not promise to remove. Specialty-treatment policy is TBD, so the
 * site states the limit and stops there.
 */
export const notGuaranteed =
  'Oil, rust, paint, gum, and deeply embedded stains are not guaranteed to come out. Some of it is permanent. We will tell you what to expect before we start rather than after.';
