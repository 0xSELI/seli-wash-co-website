/**
 * The only ambient motion on the site: an 8-14px rise as sections enter.
 *
 * Content is visible until this enhancement has successfully initialized.
 * A failed module download must never hide pricing, navigation, or other content.
 */

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const items = document.querySelectorAll<HTMLElement>('.rise');

function revealAll(): void {
  items.forEach((el) => el.classList.add('is-in'));
}

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealAll();
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  items.forEach((el) => {
    el.classList.add('reveal-pending');
    observer.observe(el);
  });
}
