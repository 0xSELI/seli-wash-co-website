/**
 * Single source of truth for every business fact on this site.
 *
 * This mirrors BUSINESS_INPUTS.md, which is the authority. If the two disagree,
 * BUSINESS_INPUTS.md wins and this file is wrong.
 *
 * RULES ENFORCED HERE — read before editing:
 *
 *  1. No credential exists. There is no insurance, licence, registration,
 *     certification, training, or guarantee. Do not add a field for one, and do
 *     not add copy anywhere that implies one. The words "insured", "bonded",
 *     "verified", "certified", and "licensed" must not appear on the site.
 *  2. No response-time promise has been set. There is deliberately no field for
 *     it. Do not add "we reply within X" anywhere.
 *  3. No reviews, ratings, completed-project photos, job counts, or years of
 *     experience exist. Never fabricate any of them.
 *  4. There is no online booking. Requests are confirmed by hand.
 *  5. Residential driveway introductory pricing is confirmed: $100 covers up
 *     to 900 square feet, then $0.12 per additional square foot, for the
 *     first 10 residential customers. After the offer the additional rate is $0.15.
 *  6. Nothing may claim the concrete images are SELI Pressure Washing work.
 *
 * Anything genuinely undecided is typed as `null` with a TBD comment rather
 * than filled with a plausible guess.
 */

export const business = {
  /** Public trading name. No legal entity is registered — never append a suffix. */
  name: 'SELI Pressure Washing',
  /** Split for the wordmark treatment only. */
  nameParts: { lead: 'SELI', rest: 'Pressure Washing' },
  tagline: 'Concrete Cleaning in Duncan',

  /** Plain description of what the business actually does, safe for meta tags. */
  shortDescription:
    'Concrete cleaning for driveways, sidewalks, porches, patios, pool decks, and steps in Duncan, Oklahoma.',

  phone: {
    /** Owner's personal phone. Texts allowed and preferred. */
    display: '(580) 560-9673',
    e164: '+15805609673',
    textPreferred: true,
  },

  email: '0xseli.business@gmail.com',

  hours: {
    /** When calls and texts are answered. */
    contact: 'Calls and texts 9am – 11pm',
    /** When jobs are actually worked. */
    work: 'Jobs Tuesday and Thursday, 9am – 6pm',
    workDaysShort: 'Tuesday & Thursday',
    /** Available if requested. Explicitly NOT guaranteed. */
    weekends: 'Weekends sometimes possible by request, not guaranteed',
  },

  area: {
    city: 'Duncan',
    state: 'Oklahoma',
    stateAbbr: 'OK',
    label: 'Duncan, Oklahoma',
    /** Outside Duncan considered by request. */
    beyond: 'Outside Duncan considered by request',
    travelChargePerMile: 5,
    /** TBD — no other towns or exclusions confirmed. Do not invent any. */
    otherTowns: null,
  },

  pricing: {
    standalone: { sidewalk: 50, porch: 50, patioOrPoolDeck: 50 },
    surfacePricePerSquareFoot: { sidewalk: 0.12, porch: 0.12, patio: 0.12 },
    jobMinimum: 100,
    perStep: 10,
    estimatesFree: true,
    drivewayIntroductory: {
      basePrice: 100,
      includedSquareFeet: 900,
      additionalPricePerSquareFoot: 0.12,
      standardAdditionalPricePerSquareFoot: 0.15,
      customerLimit: 10,
    },
    /**
     * Factors that move the final quote. Kept as data so the same list appears
     * everywhere and cannot drift between pages.
     */
    quoteFactors: [
      'size',
      'buildup and staining',
      'access',
      'surface condition',
      'specialty treatment',
      'travel',
    ],
    /** TBD — payment timing, deposits, discounts, late fees. */
    paymentTiming: null,
    deposits: null,
    discounts: null,
  },

  payments: ['Cash', 'Cash App', 'PayPal', 'Venmo'],

  equipment: {
    hoseFeet: 25,
    cordFeet: 25,
    /** What the customer has to provide. Becomes qualifying questions on the form. */
    requirements: [
      'An accessible outdoor water spigot',
      'A working outdoor GFCI-protected outlet',
    ],
    reachSummary:
      'We carry 25 feet of pressure hose and a 25-foot extension cord, so the area needs to be within reach of both.',
  },

  /**
   * Things that do not exist. Present as explicit `false` so any component that
   * wants to render them has to confront the fact rather than assume.
   */
  absent: {
    insurance: false,
    licence: false,
    registration: false,
    certification: false,
    guarantee: false,
    reviews: false,
    completedProjectPhotos: false,
    ownerPhoto: false,
    ownerStory: false,
    googleBusinessProfile: false,
    onlineBooking: false,
    responseTimePromise: false,
  },

  /** Purchased and owner-controlled. */
  domain: { proposed: 'seliwash.com', confirmed: true },

  legal: {
    /** TBD — required before public launch. */
    privacyPolicy: null,
    terms: null,
    /** Consent is limited to contact about the requested estimate. */
    /** Noun phrase. Callers supply the verb, so it reads naturally in context. */
    consentScope: 'about this estimate request',
    promotionalSmsConsent: false,
  },
} as const;

export const tel = `tel:${business.phone.e164}`;
export const sms = `sms:${business.phone.e164}`;
export const mailto = `mailto:${business.email}`;
const pricing = business.pricing;
const intro = pricing.drivewayIntroductory;
export const drivewayBaseSummary = `$${intro.basePrice} up to ${intro.includedSquareFeet} sq. ft.`;
export const drivewayOfferSummary = `Introductory Pricing for the first ${intro.customerLimit} residential customers. Add $${intro.additionalPricePerSquareFoot.toFixed(2)} per sq. ft. above ${intro.includedSquareFeet}; after the offer, $${intro.standardAdditionalPricePerSquareFoot.toFixed(2)} per additional sq. ft.`;
export const drivewayPricingSummary = `For the first ${intro.customerLimit} residential customers, driveway Introductory Pricing is ${drivewayBaseSummary}, then $${intro.additionalPricePerSquareFoot.toFixed(2)} per additional sq. ft. After the offer, the same $${intro.basePrice} minimum covers ${intro.includedSquareFeet} sq. ft., then $${intro.standardAdditionalPricePerSquareFoot.toFixed(2)} per additional sq. ft.`;
export function surfacePricingNote(surface: keyof typeof pricing.surfacePricePerSquareFoot): string {
  const minimum = pricing.standalone[surface === 'patio' ? 'patioOrPoolDeck' : surface];
  return `$${pricing.surfacePricePerSquareFoot[surface].toFixed(2)} per sq. ft. with a $${minimum} surface minimum. The combined appointment has a $${pricing.jobMinimum} minimum.`;
}
export const jobMinimumSummary = `The $${pricing.jobMinimum} appointment minimum applies once to the combined service total, not to each surface.`;
export const measuredSurfaceSummary = `Porch, sidewalk, and patio are each $${pricing.surfacePricePerSquareFoot.porch.toFixed(2)} per sq. ft., with their own $${pricing.standalone.porch} surface minimum. Steps are $${pricing.perStep} per step.`;
export const standalonePricingSummary = `${measuredSurfaceSummary} Pool decks are quoted separately with a $${pricing.standalone.patioOrPoolDeck} surface minimum. ${jobMinimumSummary} Specialty stain treatments and travel may cost extra after review.`;

/** Reads "size, buildup and staining, access, surface condition, specialty treatment, and travel". */
export function quoteFactorSentence(): string {
  const f = [...business.pricing.quoteFactors];
  const last = f.pop();
  return `${f.join(', ')}, and ${last}`;
}
