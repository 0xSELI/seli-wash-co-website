import { drivewayIntroductoryPrice, formatDrivewayPrice } from '../lib/driveway-pricing';

const input = document.querySelector<HTMLInputElement>('[data-driveway-size]');
const result = document.querySelector<HTMLElement>('[data-driveway-price]');

if (input && result) {
  const update = () => {
    const squareFeet = Number(input.value);
    result.textContent = Number.isFinite(squareFeet) && squareFeet >= 0
      ? formatDrivewayPrice(drivewayIntroductoryPrice(squareFeet))
      : 'Enter a valid size';
  };

  input.addEventListener('input', update);
}
