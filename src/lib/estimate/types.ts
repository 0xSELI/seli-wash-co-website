/**
 * The estimate request is composed in the browser and handed to the visitor's
 * own messaging app. That is the whole design, not a stage on the way to
 * something else.
 *
 * Consequences that the rest of the code depends on:
 *
 *  - The website never transmits anything. There is no endpoint, no upload, and
 *    no server-side copy of a visitor's answers.
 *  - The business receives the request only when the visitor sends the text
 *    themselves. Nothing in this app may state or imply otherwise.
 *  - Photos are attached by the visitor in their messaging app. A file input is
 *    offered so people can pick images while they are thinking about the job,
 *    and their names are carried into the message as a checklist, but the bytes
 *    never leave the browser.
 */

export type EstimatePayload = {
  name: string;
  /** At least one of phone/email is required; both may be present. */
  phone: string;
  email: string;
  contactPreference: 'text' | 'call' | 'email';
  address: string;
  /** Free text — the service area is Duncan plus "by request", so no ZIP rules. */
  cityOrZip: string;
  /** Slugs from src/data/services.ts. */
  services: string[];
  stepCount: string;
  approximateSize: string;
  timing: string;
  notes: string;
  /** Qualifying answers. 'unsure' is a legitimate answer and must not block. */
  hasSpigot: 'yes' | 'no' | 'unsure';
  hasGfciOutlet: 'yes' | 'no' | 'unsure';
  withinReach: 'yes' | 'no' | 'unsure';
  /** Consent is scoped to this estimate only. No promotional SMS. */
  contactConsent: boolean;
  /** Names only. The files themselves are attached by the visitor. */
  photos: { name: string; size: number; type: string }[];
};

export type ComposeResult =
  | {
      ok: true;
      /** `sms:` URL carrying the request for the visitor to review and send. */
      href: string;
      /** Shown to the visitor. Must make clear that sending is their action. */
      message: string;
    }
  | {
      ok: false;
      message: string;
    };

export type RequestComposer = {
  /** Identifier for logs. */
  id: string;
  /** Turns validated answers into a message the visitor can review and send. */
  compose(payload: EstimatePayload): ComposeResult;
};
