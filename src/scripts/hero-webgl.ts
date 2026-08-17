/**
 * Layer 2 of the hero: the three.js enhancement.
 *
 * WHAT IT ADDS, AND WHAT IT REFUSES TO DO
 *
 * The two concrete photographs are the owner's material and must be shown as
 * supplied. So this scene does not re-texture, tint, blur, or overlay them.
 * Outside a narrow band either side of the wash front, every pixel is a
 * straight sample of the source photograph, colour-managed to match what the
 * plain <img> layer renders.
 *
 * Inside that band — roughly 2% of the viewport width — it adds the two things
 * water actually does: a small horizontal refraction ripple, and a wet
 * highlight. That is the "one refined three.js moment" the approved balanced
 * animation level calls for, and it is confined to the front so the material
 * itself is never editorialised.
 *
 * It is also entirely disposable. If the import fails, the context is lost, or
 * the viewport drops to phone width, this tears itself down and the CSS reveal
 * underneath keeps working.
 */

import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type Texture,
} from 'three';

const CLEAN_SRC = '/img/concrete-clean.jpg';
const DIRTY_SRC = '/img/concrete-dirty.jpg';

/** Source images are 1500x1000. */
const TEX_ASPECT = 1.5;

/** Half-width of the affected band, in UV. Everything outside is untouched. */
const FRONT_BAND = 0.02;

const MAX_DPR = 1.75;
const TEARDOWN_BELOW = 821;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D uClean;
  uniform sampler2D uDirty;
  uniform float uPos;          // wash front, 0..1 across the viewport
  uniform float uCanvasAspect;
  uniform float uTexAspect;
  uniform float uTime;
  uniform float uBand;
  uniform vec2  uPixel;        // 1 / resolution, for an antialiased edge

  varying vec2 vUv;

  // Reproduces CSS object-fit: cover, so the WebGL layer frames the photograph
  // identically to the <img> it replaces.
  vec2 coverUv(vec2 uv) {
    vec2 s = vec2(1.0);
    if (uCanvasAspect > uTexAspect) {
      s.y = uTexAspect / uCanvasAspect;
    } else {
      s.x = uCanvasAspect / uTexAspect;
    }
    return (uv - 0.5) * s + 0.5;
  }

  void main() {
    float d = vUv.x - uPos;                       // signed distance from front
    float nearFront = smoothstep(uBand, 0.0, abs(d));

    // Refraction, confined to the band. nearFront is 0 elsewhere, so uv is
    // returned unmodified and the photograph is sampled as-is.
    float ripple = sin(vUv.y * 46.0 + uTime * 2.1) * 0.0035
                 + sin(vUv.y * 121.0 - uTime * 3.4) * 0.0014;
    vec2 uv = vec2(vUv.x + ripple * nearFront, vUv.y);
    vec2 cuv = coverUv(uv);

    vec3 clean = texture2D(uClean, cuv).rgb;
    vec3 dirty = texture2D(uDirty, cuv).rgb;

    // Effectively a hard edge, feathered across ~1.5px to avoid stair-stepping.
    float edge = smoothstep(-uPixel.x * 1.5, uPixel.x * 1.5, d);
    vec3 col = mix(dirty, clean, edge);

    // Wet light on the front itself, plus a short spray falloff onto the side
    // that has just been cleaned.
    float core = smoothstep(uBand * 0.35, 0.0, abs(d));
    float spray = smoothstep(uBand * 3.0, 0.0, max(d, 0.0));
    col += vec3(0.62, 0.88, 0.95) * (core * 0.42 + spray * 0.08);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function mountHeroWebGL(
  hero: HTMLElement,
  input: HTMLInputElement,
): void {
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-hero-canvas]');
  if (!canvas) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
  } catch {
    return;
  }
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

  const uniforms = {
    uClean: { value: null as Texture | null },
    uDirty: { value: null as Texture | null },
    uPos: { value: 1 },
    uCanvasAspect: { value: 1.5 },
    uTexAspect: { value: TEX_ASPECT },
    uTime: { value: 0 },
    uBand: { value: FRONT_BAND },
    uPixel: { value: new Vector2(0.001, 0.001) },
  };

  const mesh = new Mesh(
    new PlaneGeometry(1, 1),
    new ShaderMaterial({ vertexShader, fragmentShader, uniforms }),
  );
  scene.add(mesh);

  let disposed = false;
  let running = false;
  let frame = 0;
  const startedAt = performance.now();

  const resize = (): void => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (w === 0 || h === 0) return;
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    uniforms.uCanvasAspect.value = w / h;
    uniforms.uPixel.value.set(1 / w, 1 / h);
  };

  const readPos = (): number => {
    // The CSS custom property is the shared source of truth, so keyboard input,
    // pointer drags, and the load sweep all drive the scene through one path.
    const raw = getComputedStyle(hero).getPropertyValue('--pos').trim();
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed / 100 : input.valueAsNumber / 100;
  };

  const render = (): void => {
    if (disposed) return;
    uniforms.uPos.value = readPos();
    uniforms.uTime.value = (performance.now() - startedAt) / 1000;
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };

  const start = (): void => {
    if (disposed || running) return;
    running = true;
    frame = requestAnimationFrame(render);
  };

  const stop = (): void => {
    running = false;
    cancelAnimationFrame(frame);
  };

  const dispose = (): void => {
    if (disposed) return;
    disposed = true;
    stop();
    hero.removeAttribute('data-webgl');
    io?.disconnect();
    window.removeEventListener('resize', resize);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    uniforms.uClean.value?.dispose();
    uniforms.uDirty.value?.dispose();
    mesh.geometry.dispose();
    (mesh.material as ShaderMaterial).dispose();
    renderer.dispose();
  };

  // A lost context must not leave a blank canvas over the content.
  const onContextLost = (event: Event): void => {
    event.preventDefault();
    dispose();
  };
  canvas.addEventListener('webglcontextlost', onContextLost);

  // Costly effects pause off screen, per the performance guardrails.
  let io: IntersectionObserver | null = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.01 },
    );
    io.observe(hero);
  }

  window.addEventListener('resize', resize, { passive: true });

  // If the viewport narrows to the stacked phone composition, hand back to CSS.
  const narrow = window.matchMedia(`(max-width: ${TEARDOWN_BELOW - 1}px)`);
  narrow.addEventListener('change', (e) => {
    if (e.matches) dispose();
  });

  const loader = new TextureLoader();
  const load = (src: string): Promise<Texture> =>
    new Promise((resolve, reject) => {
      loader.load(
        src,
        (texture) => {
          texture.colorSpace = SRGBColorSpace;
          resolve(texture);
        },
        undefined,
        () => reject(new Error(`texture failed: ${src}`)),
      );
    });

  // Both images are already in the browser cache — the <img> tags fetched them
  // at high priority — so this resolves without a second network trip.
  Promise.all([load(CLEAN_SRC), load(DIRTY_SRC)])
    .then(([clean, dirty]) => {
      if (disposed) {
        clean.dispose();
        dirty.dispose();
        return;
      }
      uniforms.uClean.value = clean;
      uniforms.uDirty.value = dirty;
      resize();
      // Only now is it safe to hide the DOM images.
      hero.setAttribute('data-webgl', 'on');
      if (!io) start();
    })
    .catch(() => dispose());
}
