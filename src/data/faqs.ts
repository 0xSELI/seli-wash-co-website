/**
 * FAQ content. Every answer has to survive the BUSINESS_INPUTS.md test:
 * no response-time promise, no credential claim, no guarantee, no booking.
 */

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    q: 'Do I need to be home?',
    a: 'No, as long as we can reach the area and you have approved the price. We will agree access with you beforehand rather than turning up and guessing.',
  },
  {
    q: 'Do you need my water and power?',
    a: 'Yes. We run off your outdoor water spigot and a working outdoor GFCI-protected outlet, and both have to be reachable from the area being cleaned.',
  },
  {
    q: 'How far can you reach from the spigot and outlet?',
    a: 'We carry 25 feet of pressure hose and a 25-foot extension cord. If the area you want cleaned sits further than that from an outdoor spigot and outlet, tell us when you ask — some jobs we can work around, and some we will have to turn down. That is cheaper to sort out by text than by driving over.',
  },
  {
    q: 'Is an electric washer strong enough for concrete?',
    a: 'For the flatwork we take on — driveways, sidewalks, patios, porches, and steps — yes. It is also quieter than a gas machine and puts no engine exhaust next to your house while it runs.',
  },
  {
    q: 'What surfaces do you not clean?',
    a: 'We take on ordinary concrete flatwork. We do not offer roof washing, house or siding soft washing, gutters, fences, decks, sealing, or joint-sand replacement, and we do not work on decorative, painted, coated, sealed, stamped, or otherwise fragile surfaces. Anything unusual gets looked at first and may be declined — we would rather turn a job down than damage a finish.',
  },
  {
    q: 'Will pressure damage my concrete?',
    a: 'Sound concrete handles it. Older or worn surfaces get less pressure and more dwell time. If a surface looks like it will not take a wash, we will say so instead of doing it anyway.',
  },
  {
    q: 'What changes the price?',
    a: 'Size, buildup and staining, access, surface condition, any specialty treatment, and travel outside Duncan. There is a $50 minimum on standalone appointments, and the listed prices are introductory starting points rather than quotes.',
  },
  {
    q: 'When can you come out?',
    a: 'Jobs run Tuesdays and Thursdays, 9am to 6pm. Weekends are sometimes possible by request but are not guaranteed. Calls and texts are answered 9am to 11pm. Every request is confirmed by hand, so treat sending one as the start of a conversation rather than a booked slot.',
  },
  {
    q: 'How do I pay?',
    a: 'Cash, Cash App, PayPal, or Venmo.',
  },
];

/** Shorter set for the homepage preview. */
export const faqPreview: Faq[] = faqs.slice(1, 6);
