# SELI Wash Co. website

Production website for SELI Wash Co., a concrete flatwork pressure-washing business serving Duncan, Oklahoma.

The site is built and live at **https://seliwash.com**.

## Stack

- **Astro 7**, static output (`output: 'static'`) — no server runtime, no adapter
- **TypeScript**, type-checked locally by `astro check` (the deploy workflow only builds, so run `npm run verify` yourself)
- **Three.js** for the optional WebGL hero enhancement, loaded lazily and only when it can pay for itself
- `@astrojs/sitemap` for `sitemap-index.xml`
- No CSS framework. Hand-written tokens in `src/styles/tokens.css` and `src/styles/global.css`
- Images are pre-sized in `public/` and go through `passthroughImageService()`, so `sharp` is never invoked at build time

## Local development

```powershell
npm install
```

```powershell
npm run dev
```

Run the complete production check before publishing:

```powershell
npm run verify
```

`verify` is `astro check && astro build`. It must report 0 errors before anything is pushed. The generated site is written to `dist/`, which is gitignored — the deployment builds its own copy.

Node.js `22.16.0`, pinned in `.nvmrc`.

## Deployment

The site is hosted on **GitHub Pages**, not Cloudflare and not Vercel.

- Repository: `0xSELI/seli-wash-co-website`
- Workflow: `.github/workflows/deploy.yml`, using `withastro/action` and `actions/deploy-pages`
- Trigger: every push to `main`, plus manual `workflow_dispatch`
- Custom domain: `public/CNAME` contains `seliwash.com`; `public/_redirects` sends `www` to the apex

Pushing to `main` publishes to production. There is no staging environment and no preview deployment, so treat `main` as live and do not push without the owner's approval.

`public/_headers` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and a `Permissions-Policy` that denies camera, geolocation, and microphone.

## Pages

Eight routes are built: Home, Services, Gallery, About, Contact, Privacy, Terms, and a 404.

## Implemented features

### Estimate workflow (SMS)

The estimate form does not send data to a server. It validates the visitor's answers in the browser, composes a text message addressed to SELI Wash Co., and opens the visitor's messaging app. The visitor reviews the message, attaches any photos, and sends it.

- UI: `src/components/EstimateForm.astro`, behaviour in `src/scripts/estimate-form.ts`
- Composer: `src/lib/estimate/` — see `src/lib/estimate/README.md` for the invariants
- The form covers how to reach you, the property, what needs cleaning, water and power, photos, and anything else. The spigot and GFCI-outlet questions are qualifying questions, not decoration: the equipment is electric with 25 ft of hose and 25 ft of cord.
- Nothing is transmitted by the site. Photo bytes never leave the browser; only filenames are carried into the message as a checklist for the visitor.
- The composer refuses to build an `sms:` URL longer than 1800 characters, because some platforms silently truncate them.

### Hero reveal slider

A before-and-after reveal on the two supplied concrete photographs, working on both desktop and mobile.

- `src/components/RevealHero.astro`, `src/scripts/hero-reveal.ts`, `src/scripts/hero-webgl.ts`
- Layer 1 is a native range input. It is the single source of truth for the front position via the `--pos` custom property, so pointer, touch, and keyboard all drive the same value. Arrow and page keys get conventional slider increments rather than the 0.1% native step.
- An intro sweep runs on load and is cancelled on the first sign of manual input, so it can never fight a drag.
- Layer 2 is the Three.js scene. It is attempted only above 821px, only without `prefers-reduced-motion`, only when a WebGL context exists, and only at idle. It reads `--pos` rather than keeping its own position. Failure is silent because layer 1 is already running.
- Under `prefers-reduced-motion` the hero lands on its rest position immediately and dragging still works.

### Responsive layout

- Below 820px the hero becomes a stacked panel and WebGL is not started.
- `src/components/MobileActionBar.astro` docks Call / Text / Estimate to the bottom of the viewport below 820px, with 48px touch targets and `env(safe-area-inset-bottom)` padding. Text is marked as the preferred channel; amber stays reserved for the primary action.

### Brand and map

- Logo assets live in `public/brand/`. `src/components/Wordmark.astro` renders `seli-wash-logo-site.png` at 68px, dropping to 52px below 420px.
- `src/components/DuncanMap.astro` renders the Duncan street map from `public/img/duncan-street-map.png`, with the named streets in the alt text.

## Business content

Verified business facts live in `src/data/business.ts`, services and pricing in `src/data/services.ts`, and FAQs in `src/data/faqs.ts`. `BUSINESS_INPUTS.md` is the authority — if it and the code disagree, the code is wrong.

Do not add reviews, credentials, completed-project photos, guarantees, or operating promises unless the business can support them. The rules are written out at the top of `src/data/business.ts` and they are not stylistic preferences:

- No credential of any kind exists. The words *insured*, *bonded*, *verified*, *certified*, and *licensed* must not appear on the site.
- No response-time promise has been set, so none is published.
- No reviews, ratings, completed-project photos, job counts, or years of experience exist. Never fabricate any of them.
- There is no online booking. Requests are confirmed by hand.
- Square-foot coverage limits and per-square-foot overages are not confirmed and must not be published.
- The concrete images are supplied placeholders and nothing may claim they are SELI Wash Co. work.

Anything genuinely undecided is typed as `null` in the data files with a TBD comment rather than filled with a plausible guess.

## Project history

`HANDOFF.md` records the planning and design-concept work that preceded implementation, and `DESIGN.md`, `PROJECT_BRIEF.md`, and `BUSINESS_INPUTS.md` carry the direction, scope, and owner-supplied facts. The original concept page still lives in `concepts/` and is a historical artefact, not a starting point — the shipped site was built fresh rather than grown out of it.
