import type { ComposeResult, EstimatePayload, RequestComposer } from './types';
import { business } from '../../data/business';
import { services } from '../../data/services';

/**
 * Builds the estimate request as a text message for the visitor to review and
 * send from their own messaging app.
 *
 * Texting is the owner's preferred channel, so this is the direct route rather
 * than a detour: the visitor keeps their own copy in their sent messages, photos
 * ride along as real attachments, and the reply lands in a thread they already
 * have. It also means the site holds nothing and transmits nothing.
 */
export const smsComposer: RequestComposer = {
  id: 'sms',

  compose(payload: EstimatePayload): ComposeResult {
    const href = buildSmsHref(payload);

    // sms: URLs get truncated by some platforms once they grow past a couple of
    // thousand characters, which would silently drop the end of the request.
    if (href.length > 1800) {
      return {
        ok: false,
        message:
          'These details are a little long for one text. Shorten the notes and try again, or send a short message and we will ask for the rest.',
      };
    }

    return {
      ok: true,
      href,
      message:
        'Your details are in a text message addressed to us. Open it, add any photos, and send it when you are happy with it.',
    };
  },
};

/** Human-readable message body. The owner reads this, so no slugs or codes. */
export function buildSmsHref(payload: EstimatePayload): string {
  const nameBySlug = new Map(services.map((s) => [s.slug, s.name]));
  const chosen = payload.services.length
    ? payload.services.map((slug) => nameBySlug.get(slug) ?? slug).join(', ')
    : 'not specified';

  const reach = [
    `spigot ${payload.hasSpigot}`,
    `GFCI outlet ${payload.hasGfciOutlet}`,
    `within ${business.equipment.hoseFeet}ft ${payload.withinReach}`,
  ].join(', ');

  const contactBack = [
    payload.phone ? `phone ${payload.phone}` : '',
    payload.email ? `email ${payload.email}` : '',
  ]
    .filter(Boolean)
    .join(', ');

  const lines = [
    `Estimate request — ${payload.name || 'name not given'}`,
    `Address: ${payload.address || 'not given'}${
      payload.cityOrZip ? `, ${payload.cityOrZip}` : ''
    }`,
    `Service: ${chosen}`,
    payload.stepCount ? `Steps: ${payload.stepCount}` : '',
    payload.approximateSize ? `Size: ${payload.approximateSize}` : '',
    payload.timing && payload.timing !== 'No preference'
      ? `Timing: ${payload.timing}`
      : '',
    `Water/power: ${reach}`,
    contactBack ? `Reach me: ${contactBack} (prefers ${payload.contactPreference})` : '',
    payload.notes ? `Notes: ${payload.notes}` : '',
    payload.photos.length
      ? `Photos: ${payload.photos.length} to attach — ${payload.photos
          .map((p) => p.name)
          .join(', ')}`
      : '',
  ].filter(Boolean);

  return `sms:${business.phone.e164}?&body=${encodeURIComponent(lines.join('\n'))}`;
}
