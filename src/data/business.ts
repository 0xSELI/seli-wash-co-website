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
 *  5. Square-foot coverage limits and per-square-foot overages are NOT
 *     confirmed and must not be published.
 *  6. Nothing may claim the concrete images are SELI Wash Co. work.
 *
 * Anything genuinely undecided is typed as `null` with a TBD comment rather
 * than filled with a plausible guess.
 */

export const business = {
  /** Public trading name. No legal entity is registered — never append a suffix. */
  name: 'SELI Wash Co.',
  /** Split for the wordmark treatment only. */
  nameParts: { lead: 'SELI', rest: 'Wash Co.' },
  tagline: 'Concrete Cleaning in Duncan',

  /** Plain description of what the business actually does, safe for meta tags. */
  shortDescription:
    'Concrete cleaning for driveways, sidewalks, patios, porches, and steps in Duncan, Oklahoma.',

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
    /** Minimum on a standalone appointment. */
    standaloneMinimum: 50,
    estimatesFree: true,
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

/** Reads "size, buildup and staining, access, surface condition, specialty treatment, and travel". */
export function quoteFactorSentence(): string {
  const f = [...business.pricing.quoteFactors];
  const last = f.pop();
  return `${f.join(', ')}, and ${last}`;
}
