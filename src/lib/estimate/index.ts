import type { RequestComposer } from './types';
import { smsComposer } from './sms-composer';

/**
 * The estimate workflow: validate in the browser, then hand the visitor a text
 * message they review and send themselves.
 */
export const composer: RequestComposer = smsComposer;

export type { ComposeResult, EstimatePayload, RequestComposer } from './types';
export { buildSmsHref } from './sms-composer';
