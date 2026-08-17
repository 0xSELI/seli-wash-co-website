/**
 * Estimate form behaviour: validation, states, photo workflow, submission.
 *
 * Design rules this file follows:
 *
 *  - Validation runs on submit, not on every keystroke. Errors that appear
 *    while someone is still typing their email are hostile. Once a field has
 *    been marked invalid it re-checks on blur and on input, so corrections
 *    clear immediately.
 *  - Every error is announced twice over: inline next to the field, and in a
 *    focusable summary at the top with jump links.
 *  - The reach questions never block submission. They produce an advisory,
 *    because "not sure" is an honest answer and the owner would rather have the
 *    conversation than lose the lead.
 *  - The end of the flow is a text message the visitor reviews and sends. The
 *    copy therefore never says "sent", "received", or "submitted" — sending is
 *    the visitor's action and happens in their messaging app, not here.
 */

import { composer, type EstimatePayload } from '../lib/estimate';

const MAX_PHOTOS = 5;
const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
/** Anything faster than this is almost certainly not a person. */
const MIN_FILL_MS = 2500;

const form = document.querySelector<HTMLFormElement>('[data-estimate-form]');

if (form) {
  // Hoisted function declarations below lose the null-narrowing on `form`, so
  // hold a non-null reference for them to close over.
  const formEl: HTMLFormElement = form;

  const summary = document.querySelector<HTMLElement>('[data-error-summary]');
  const summaryList = document.querySelector<HTMLUListElement>('[data-error-list]');
  const summaryCount = document.querySelector<HTMLElement>('[data-error-count]');
  const result = document.querySelector<HTMLElement>('[data-result]');
  // No submit-button state to manage: composing the message is synchronous, so
  // there is no in-flight moment to show and nothing to disable.
  const stepsField = document.querySelector<HTMLElement>('[data-steps-field]');
  const advisory = document.querySelector<HTMLElement>('[data-reach-advisory]');
  const fileInput = form.querySelector<HTMLInputElement>('#photos');
  const fileList = document.querySelector<HTMLUListElement>('[data-file-list]');
  const fileCount = document.querySelector<HTMLElement>('[data-file-count]');

  const mountedAt = Date.now();
  /** Files that passed validation, kept separately so rejects can be dropped. */
  let acceptedFiles: File[] = [];
  let dirtyFields = new Set<string>();

  // ---------------------------------------------------------------- helpers

  const field = (name: string): HTMLElement | null =>
    form.querySelector<HTMLElement>(`[name="${name}"]`);

  const errorEl = (name: string): HTMLElement | null =>
    form.querySelector<HTMLElement>(`[data-err-for="${name}"]`);

  const value = (name: string): string => {
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[name="${name}"]`,
    );
    return el ? el.value.trim() : '';
  };

  const radioValue = (name: string): string => {
    const el = form.querySelector<HTMLInputElement>(`[name="${name}"]:checked`);
    return el ? el.value : '';
  };

  const checkedValues = (name: string): string[] =>
    Array.from(
      form.querySelectorAll<HTMLInputElement>(`[name="${name}"]:checked`),
    ).map((el) => el.value);

  const isChecked = (name: string): boolean =>
    Boolean(form.querySelector<HTMLInputElement>(`[name="${name}"]`)?.checked);

  function setError(name: string, message: string | null): void {
    const el = errorEl(name);
    const input = field(name);
    if (el) {
      el.textContent = message ?? '';
      el.hidden = message === null;
    }
    if (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      const describedBy = el?.id || `err-${name}`;
      if (el && !el.id) el.id = describedBy;
    }
  }

  // ------------------------------------------------------- steps disclosure

  function syncStepsField(): void {
    if (!stepsField) return;
    const stepsSelected = checkedValues('services').includes('steps-entry-pads');
    stepsField.hidden = !stepsSelected;
    if (!stepsSelected) setError('stepCount', null);
  }

  // ------------------------------------------------------- reach advisory

  function syncAdvisory(): void {
    if (!advisory) return;
    const spigot = radioValue('hasSpigot');
    const outlet = radioValue('hasGfciOutlet');
    const reach = radioValue('withinReach');

    const missing = spigot === 'no' || outlet === 'no' || reach === 'no';
    const unsure =
      spigot === 'unsure' || outlet === 'unsure' || reach === 'unsure';

    if (missing) {
      advisory.textContent =
        'Worth knowing: without a spigot and outdoor outlet in reach, this job may not be one we can do. Send the request anyway — we will look at it and tell you straight, and it costs you nothing to ask.';
      advisory.hidden = false;
    } else if (unsure) {
      advisory.textContent =
        'Not sure is fine. Mention it in the notes if you can, or send a photo of the outside of the house by text and we will work it out from there.';
      advisory.hidden = false;
    } else {
      advisory.hidden = true;
      advisory.textContent = '';
    }
  }

  // --------------------------------------------------------- photo workflow

  function renderFiles(rejected: { name: string; reason: string }[]): void {
    if (!fileList || !fileCount) return;
    fileList.innerHTML = '';

    for (const file of acceptedFiles) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = `${file.name} — ${formatBytes(file.size)}`;
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'btn btn-outline';
      remove.style.padding = '0.3rem 0.6rem';
      remove.style.fontSize = 'var(--s1)';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${file.name}`);
      remove.addEventListener('click', () => {
        acceptedFiles = acceptedFiles.filter((f) => f !== file);
        renderFiles([]);
      });
      li.append(label, remove);
      fileList.append(li);
    }

    for (const item of rejected) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.className = 'bad';
      label.textContent = `${item.name} — ${item.reason}`;
      li.append(label);
      fileList.append(li);
    }

    fileCount.textContent =
      acceptedFiles.length === 0
        ? 'No photos chosen'
        : `${acceptedFiles.length} photo${acceptedFiles.length === 1 ? '' : 's'} chosen`;
  }

  fileInput?.addEventListener('change', () => {
    const incoming = Array.from(fileInput.files ?? []);
    const rejected: { name: string; reason: string }[] = [];

    for (const file of incoming) {
      if (!file.type.startsWith('image/')) {
        rejected.push({ name: file.name, reason: 'not an image' });
        continue;
      }
      if (file.size > MAX_PHOTO_BYTES) {
        rejected.push({
          name: file.name,
          reason: `too large (${formatBytes(file.size)}, limit ${formatBytes(MAX_PHOTO_BYTES)})`,
        });
        continue;
      }
      if (acceptedFiles.length >= MAX_PHOTOS) {
        rejected.push({ name: file.name, reason: `over the ${MAX_PHOTOS}-photo limit` });
        continue;
      }
      acceptedFiles.push(file);
    }

    setError(
      'photos',
      rejected.length
        ? `${rejected.length} file${rejected.length === 1 ? '' : 's'} could not be added. The rest are fine.`
        : null,
    );
    renderFiles(rejected);

    // Reset the input so re-choosing the same file fires `change` again.
    fileInput.value = '';
  });

  // ------------------------------------------------------------- validation

  type Problem = { name: string; message: string; anchor: string };

  function validate(): Problem[] {
    const problems: Problem[] = [];
    const add = (name: string, message: string, anchor = name): void => {
      problems.push({ name, message, anchor });
    };

    const name = value('name');
    const phone = value('phone');
    const email = value('email');
    const preference = radioValue('contactPreference');

    if (!name) add('name', 'Add your name so we know who we are replying to.');

    if (!phone && !email) {
      add('phone', 'Add a mobile number or an email address so we can reply.');
    }
    if (phone && !isPlausiblePhone(phone)) {
      add('phone', 'That number looks short — check the digits.');
    }
    if (email && !isPlausibleEmail(email)) {
      add('email', 'That email address is missing something.');
    }
    if ((preference === 'text' || preference === 'call') && !phone) {
      add('phone', `You asked us to ${preference}, so we need a mobile number.`);
    }
    if (preference === 'email' && !email) {
      add('email', 'You asked us to email, so we need an email address.');
    }

    if (!value('address')) add('address', 'Add the street address of the property.');
    if (!value('cityOrZip')) add('cityOrZip', 'Add the town or ZIP.');

    const chosen = checkedValues('services');
    if (chosen.length === 0) {
      add('services', 'Pick at least one surface.', 'services');
    }

    if (chosen.includes('steps-entry-pads')) {
      const steps = value('stepCount');
      const n = Number(steps);
      if (!steps) add('stepCount', 'How many steps? A rough count is fine.');
      else if (!Number.isFinite(n) || n < 1) {
        add('stepCount', 'Enter the number of steps as a whole number.');
      }
    }

    if (!isChecked('contactConsent')) {
      add('contactConsent', 'We need your OK to contact you about this estimate.');
    }

    return problems;
  }

  function showProblems(problems: Problem[]): void {
    // Clear everything first so stale errors never linger.
    for (const el of formEl.querySelectorAll<HTMLElement>('[data-err-for]')) {
      const name = el.dataset.errFor;
      if (name) setError(name, null);
    }

    const firstByField = new Map<string, Problem>();
    for (const p of problems) if (!firstByField.has(p.name)) firstByField.set(p.name, p);
    for (const [name, problem] of firstByField) setError(name, problem.message);

    if (!summary || !summaryList || !summaryCount) return;

    if (problems.length === 0) {
      summary.hidden = true;
      summaryList.innerHTML = '';
      return;
    }

    summaryCount.textContent = `${firstByField.size} thing${firstByField.size === 1 ? '' : 's'}`;
    summaryList.innerHTML = '';
    for (const [name, problem] of firstByField) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${anchorIdFor(name, problem.anchor)}`;
      link.textContent = problem.message;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        focusField(name);
      });
      li.append(link);
      summaryList.append(li);
    }
    summary.hidden = false;
    summary.focus();
  }

  function anchorIdFor(name: string, anchor: string): string {
    const el = formEl.querySelector<HTMLElement>(`#${anchor}`);
    return el ? anchor : name;
  }

  function focusField(name: string): void {
    const el = formEl.querySelector<HTMLElement>(`[name="${name}"]`);
    if (!el) return;
    el.scrollIntoView({ block: 'center', behavior: 'auto' });
    (el as HTMLInputElement).focus();
  }

  // ---------------------------------------------------------------- submit

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!result) return;

    // Honeypot and dwell time. Both fail quietly and without a message link —
    // telling a bot why it was rejected is free help.
    const honeypot = form.querySelector<HTMLInputElement>('[name="company_website"]');
    const tooFast = Date.now() - mountedAt < MIN_FILL_MS;
    if (honeypot?.value || tooFast) {
      showResult('ready', 'Your details have been checked.', null);
      return;
    }

    const problems = validate();
    showProblems(problems);
    if (problems.length > 0) {
      result.hidden = true;
      return;
    }

    const payload: EstimatePayload = {
      name: value('name'),
      phone: value('phone'),
      email: value('email'),
      contactPreference: (radioValue('contactPreference') || 'text') as
        | 'text'
        | 'call'
        | 'email',
      address: value('address'),
      cityOrZip: value('cityOrZip'),
      services: checkedValues('services'),
      stepCount: value('stepCount'),
      approximateSize: value('approximateSize'),
      timing: value('timing'),
      notes: value('notes'),
      hasSpigot: (radioValue('hasSpigot') || 'unsure') as 'yes' | 'no' | 'unsure',
      hasGfciOutlet: (radioValue('hasGfciOutlet') || 'unsure') as
        | 'yes'
        | 'no'
        | 'unsure',
      withinReach: (radioValue('withinReach') || 'unsure') as
        | 'yes'
        | 'no'
        | 'unsure',
      contactConsent: isChecked('contactConsent'),
      photos: acceptedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
      })),
    };

    const outcome = composer.compose(payload);
    if (!outcome.ok) {
      showResult('error', outcome.message, null);
      return;
    }
    showResult('ready', outcome.message, outcome.href);
  });

  /**
   * Two states only: the message is ready, or it could not be built.
   *
   * There is deliberately no "received" or "sent" state, because this app never
   * reaches that point — the visitor sends the message from their own app, and
   * only they know when they did.
   */
  function showResult(
    state: 'ready' | 'error',
    message: string,
    smsHref: string | null,
  ): void {
    if (!result) return;
    result.innerHTML = '';
    result.dataset.state = state;

    const heading = document.createElement('strong');
    heading.textContent =
      state === 'ready' ? 'Text message ready' : 'Could not build the message';
    const body = document.createElement('p');
    body.textContent = message;
    result.append(heading, body);

    if (smsHref) {
      const link = document.createElement('a');
      link.className = 'btn btn-dark';
      link.href = smsHref;
      link.textContent = 'Open text message';

      const note = document.createElement('p');
      note.className = 'result-note';
      note.textContent =
        'Nothing reaches us until you press send in your messaging app. Add photos there if you have them.';

      result.append(link, note);
    }

    result.hidden = false;
    result.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }

  // -------------------------------------------------------------- listeners

  form.addEventListener('change', (event) => {
    const target = event.target as HTMLElement | null;
    const name = target?.getAttribute('name');
    if (name === 'services') syncStepsField();
    if (name && ['hasSpigot', 'hasGfciOutlet', 'withinReach'].includes(name)) {
      syncAdvisory();
    }
    // Re-validate a field the user has already been told about.
    if (name && dirtyFields.has(name)) revalidateField(name);
  });

  form.addEventListener(
    'blur',
    (event) => {
      const name = (event.target as HTMLElement | null)?.getAttribute('name');
      if (name && dirtyFields.has(name)) revalidateField(name);
    },
    true,
  );

  form.addEventListener('input', (event) => {
    const name = (event.target as HTMLElement | null)?.getAttribute('name');
    if (name && dirtyFields.has(name)) revalidateField(name);
  });

  function revalidateField(name: string): void {
    const problems = validate().filter((p) => p.name === name);
    setError(name, problems[0]?.message ?? null);
  }

  // Track which fields have been flagged so we only nag after a submit attempt.
  form.addEventListener('submit', () => {
    dirtyFields = new Set(validate().map((p) => p.name));
  });

  syncStepsField();
  syncAdvisory();
  renderFiles([]);
}

// ------------------------------------------------------------------ utils

function isPlausibleEmail(value: string): boolean {
  // Deliberately loose. Real addresses are stranger than most regexes allow,
  // and the cost of a false rejection is a lost customer.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

function isPlausiblePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
