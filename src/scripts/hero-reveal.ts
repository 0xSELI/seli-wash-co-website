/**
 * Layer 1 of the hero: makes the reveal interactive and runs the load sweep.
 *
 * This module owns the single source of truth for the front position — the
 * `--pos` custom property on the hero element. The WebGL enhancement reads the
 * same value rather than keeping its own, so the two can never disagree.
 */

const REST = 63; // where the front settles: past the copy, into the clean side
const SWEEP_MS = 1500;
const SWEEP_DELAY_MS = 420;
/** Below this width the hero is a stacked panel and WebGL is not started. */
const WEBGL_MIN_WIDTH = 821;

const hero = document.querySelector<HTMLElement>('[data-hero]');
const input = document.querySelector<HTMLInputElement>('[data-reveal-input]');

if (hero && input) {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const calm = motionPreference.matches;

  const setPos = (value: number): void => {
    hero.style.setProperty('--pos', `${value}%`);
  };

  /**
   * The intro sweep must never fight the user. It owns two pending handles — a
   * timeout before it starts and a rAF loop while it runs — and both are
   * cancelled on the first sign of manual input. Without this, grabbing the
   * handle during the sweep results in the animation writing over every value
   * the drag produces.
   */
  let sweepTimeout: number | null = null;
  let sweepFrame: number | null = null;
  let sweepCancelled = false;

  const cancelSweep = (): void => {
    sweepCancelled = true;
    if (sweepTimeout !== null) {
      window.clearTimeout(sweepTimeout);
      sweepTimeout = null;
    }
    if (sweepFrame !== null) {
      cancelAnimationFrame(sweepFrame);
      sweepFrame = null;
    }
  };
  motionPreference.addEventListener('change', event => {
    if (event.matches) cancelSweep();
  });

  /** Anything that means "a person is driving this now". */
  const onManualInput = (): void => {
    cancelSweep();
    // The hint is an affordance prompt, not a label. Once someone has moved the
    // line it has done its job — and if it stays it collides with the headline
    // copy when the line is dragged left into the text column.
    hero.setAttribute('data-interacted', '');
  };

  input.addEventListener('input', () => {
    onManualInput();
    setPos(input.valueAsNumber);
  });

  // pointerdown and keydown fire BEFORE the value changes, so the sweep is
  // stopped on the very first frame of a grab rather than one input late.
  // Coordinates are measured against the comparison panel, not the page.
  // Capture keeps a drag continuous even when the pointer leaves the panel;
  // touch-action: pan-y still allows an intentional vertical page scroll.
  let activePointer: number | null = null;
  const positionFromPointer = (event: PointerEvent): void => {
    const bounds = input.getBoundingClientRect();
    input.value = String(Math.max(0, Math.min(100, (event.clientX - bounds.left) / bounds.width * 100)));
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  input.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button !== 0) return;
    onManualInput();
    event.preventDefault();
    input.focus({ preventScroll: true });
    activePointer = event.pointerId;
    input.setPointerCapture(event.pointerId);
    positionFromPointer(event);
  });
  input.addEventListener('pointermove', (event) => {
    if (activePointer === event.pointerId) positionFromPointer(event);
  });
  const releasePointer = (event: PointerEvent): void => {
    if (activePointer !== event.pointerId) return;
    activePointer = null;
    if (input.hasPointerCapture(event.pointerId)) input.releasePointerCapture(event.pointerId);
  };
  input.addEventListener('pointerup', releasePointer);
  input.addEventListener('pointercancel', releasePointer);
  input.addEventListener('lostpointercapture', () => { activePointer = null; });
  // Native range touch handling uses the invisible thumb's track geometry,
  // which differs from our full-panel coordinates. Suppress that second update
  // only for horizontal gestures; vertical gestures remain ordinary scrolling.
  let touchOrigin: { x: number; y: number } | null = null;
  input.addEventListener('touchstart', event => {
    onManualInput();
    const touch = event.touches[0];
    if (touch) touchOrigin = { x: touch.clientX, y: touch.clientY };
  }, { passive: true });
  input.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    if (!touch || !touchOrigin) return;
    if (Math.abs(touch.clientX - touchOrigin.x) > Math.abs(touch.clientY - touchOrigin.y)) {
      if (event.cancelable) event.preventDefault();
      const bounds = input.getBoundingClientRect();
      input.value = String(Math.max(0, Math.min(100, (touch.clientX - bounds.left) / bounds.width * 100)));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, { passive: false });
  input.addEventListener('touchend', () => { touchOrigin = null; });
  input.addEventListener('touchcancel', () => { touchOrigin = null; });

  /*
    Keyboard stepping.

    `step="0.1"` is set on the element so pointer dragging is smooth, but the
    native arrow key increment is that same 0.1% — a thousand key presses to
    cross the slider, which is keyboard support in name only. So arrows and page
    keys are given conventional slider increments here.

    The input remains the single source of truth: this writes to `input.value`
    and dispatches a normal `input` event, so every consumer — including the
    WebGL layer, which reads `--pos` — sees the change through the same path a
    drag uses. Home and End already do the right thing natively and are left
    alone. One keydown listener, not two, so the sweep cancel and the stepping
    cannot double up.
  */
  const KEY_STEP = 2;
  const KEY_STEP_LARGE = 10;

  input.addEventListener('keydown', (event: KeyboardEvent) => {
    onManualInput();

    let delta = 0;
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        delta = -KEY_STEP;
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        delta = KEY_STEP;
        break;
      case 'PageDown':
        delta = -KEY_STEP_LARGE;
        break;
      case 'PageUp':
        delta = KEY_STEP_LARGE;
        break;
      default:
        return; // Home, End, Tab, everything else: native behaviour stands.
    }

    event.preventDefault();
    const next = Math.min(100, Math.max(0, input.valueAsNumber + delta));
    input.value = String(next);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

  if (calm) {
    // No sweep. Land on the rest position immediately; dragging still works.
    input.value = String(REST);
    setPos(REST);
  } else {
    setPos(100);
    sweepTimeout = window.setTimeout(() => {
      sweepTimeout = null;
      if (sweepCancelled) return;
      let start: number | null = null;
      const step = (now: number): void => {
        if (sweepCancelled) return;
        if (start === null) start = now;
        const p = Math.min((now - start) / SWEEP_MS, 1);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const value = 100 + (REST - 100) * eased;
        input.value = String(value);
        setPos(value);
        sweepFrame = p < 1 ? requestAnimationFrame(step) : null;
      };
      sweepFrame = requestAnimationFrame(step);
    }, SWEEP_DELAY_MS);
  }

  /**
   * Layer 2, attempted only when it can pay for itself.
   *
   * Skipped for reduced motion (the whole point of the scene is movement), for
   * narrow viewports (DESIGN.md calls for simplifying heavy effects there), and
   * for anything that cannot give us a WebGL context. Failure is silent because
   * layer 1 is already running.
   *
   * Deliberately NOT gated on `(hover: hover)`. Some desktop browsers and
   * embedded webviews report `hover: none`, which silently cost real desktop
   * users the enhancement. Viewport width is the honest proxy for "big enough
   * screen to be worth it", and touch dragging works either way.
   */
  const shouldEnhance = !calm && window.innerWidth >= WEBGL_MIN_WIDTH;

  if (shouldEnhance && hasWebGL()) {
    // Wait for idle so the scene never competes with first paint or with the
    // headline and estimate button becoming usable.
    onIdle(() => {
      if (motionPreference.matches) return;
      import('./hero-webgl')
        .then((mod) => { if (!motionPreference.matches) mod.mountHeroWebGL(hero, input); })
        .catch(() => {
          /* Layer 1 stands. Nothing to report to the user. */
        });
    });
  }
  hero.dataset.revealReady = 'true';
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl'),
    );
  } catch {
    return false;
  }
}

function onIdle(fn: () => void): void {
  const ric = (
    window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }
  ).requestIdleCallback;
  if (typeof ric === 'function') ric(fn, { timeout: 2000 });
  else window.setTimeout(fn, 600);
}
