import { calculateJob, jobEstimateSms, jobEstimateMessage, type CalculatorService, type Selection, type JobQuote } from '../lib/job-pricing';
import { formatDrivewayPrice } from '../lib/driveway-pricing';
const result = document.querySelector<HTMLElement>('[data-driveway-price]');
const request = document.querySelector<HTMLAnchorElement>('[data-driveway-request]');
const message = document.querySelector<HTMLTextAreaElement>('[data-driveway-message]');
const breakdown = document.querySelector<HTMLElement>('[data-job-breakdown]');
const choices = [...document.querySelectorAll<HTMLInputElement>('[data-calc-service]')];
const quantities = [...document.querySelectorAll<HTMLInputElement>('[data-calc-quantity]')];
message?.addEventListener('focus', () => message.select());

if (result && request && message && breakdown) {
  const showUnavailable = (label: string) => {
    result.textContent = label;
    request.removeAttribute('href'); request.setAttribute('aria-disabled', 'true');
    message.value = 'Choose a service and enter valid measurements to prepare a message.';
  };
  const update = () => {
    const selected: Selection[] = [];
    let valid = true;
    for (const choice of choices) {
      const key = choice.dataset.calcService as CalculatorService;
      const input = quantities.find(q => q.dataset.calcQuantity === key)!;
      const field = document.querySelector<HTMLElement>(`[data-calc-field="${key}"]`)!;
      field.hidden = !choice.checked;
      input.disabled = !choice.checked;
      const value = Number(input.value);
      const isValid = !choice.checked || (input.value.trim() !== '' && Number.isFinite(value) && value >= 0 && Number.isSafeInteger(Math.round(value * 1000)) && (key !== 'steps' || (Number.isInteger(value) && value >= 1)));
      input.setAttribute('aria-invalid', String(!isValid));
      valid &&= isValid;
      if (choice.checked) selected.push({ service: key, quantity: value });
    }
    breakdown.replaceChildren();
    if (!valid || !selected.length) {
      showUnavailable(selected.length ? 'Enter a valid size' : 'Select a service');
      return;
    }
    let quote: JobQuote;
    try {
      quote = calculateJob(selected);
    } catch {
      showUnavailable('Enter a valid size');
      return;
    }
    const rows = [
      ...quote.lines.map(line => [`${line.name}: ${line.quantity.toLocaleString('en-US', {maximumFractionDigits:6})} ${line.unit}`, line.price] as const),
      ['Service subtotal', quote.subtotal] as const,
      ['Appointment minimum adjustment', quote.minimumAdjustment] as const,
    ];
    for (const [label, price] of rows) {
      const row = document.createElement('p'); const text = document.createElement('span'); const amount = document.createElement('strong');
      text.textContent = label; amount.textContent = formatDrivewayPrice(price); row.append(text, amount); breakdown.append(row);
    }
    result.textContent = formatDrivewayPrice(quote.total);
    request.href = jobEstimateSms(quote); request.setAttribute('aria-disabled', 'false');
    message.value = jobEstimateMessage(quote);
  };
  choices.forEach(choice => { choice.disabled = false; choice.addEventListener('change', update); });
  quantities.forEach(input => input.addEventListener('input', update));
  update();
}
