# SELI Wash Co. Website — Handoff

## Current status: built, deployed, and live

The website is implemented and in production at **https://seliwash.com**, hosted on **GitHub Pages** from the `0xSELI/seli-wash-co-website` repository. The concept stage is over; this document describes what exists, what still binds any future change, and what remains open. The planning record that preceded implementation is preserved at the end, under [Historical planning record](#historical-planning-record).

`README.md` is the practical guide to the stack, local development, and deployment. This file covers the working boundaries and project continuity.

## Read first

1. `BUSINESS_INPUTS.md` for the owner's supplied facts and every remaining TBD. **This is the authority on business facts.** Nothing may be published that contradicts it, and nothing marked TBD may be guessed.
2. `src/data/business.ts`, `src/data/services.ts`, and `src/data/faqs.ts` — the single source of truth in code. They mirror `BUSINESS_INPUTS.md`; if the two disagree, the code is wrong.
3. `README.md` for the stack, commands, and deployment.
4. `DESIGN.md` for the visual direction, animation levels, responsive behaviour, accessibility, and performance guardrails.
5. `PROJECT_BRIEF.md` for the audience, pages, and launch scope.
6. This file for workflow boundaries.

If documents conflict, pause and ask the owner rather than silently choosing.

## What is implemented

Astro 7 static site, TypeScript, no server runtime. Eight routes: Home, Services, Gallery, About, Contact, Privacy, Terms, 404, plus a generated sitemap.

- **Brand.** A real logo exists and is in use — `public/brand/`, rendered by `src/components/Wordmark.astro`. This supersedes the concept-stage decision to use a text wordmark.
- **Hero reveal slider.** Before-and-after reveal on the two supplied concrete photographs, working on desktop and mobile. A native range input owns the position via a `--pos` custom property; the Three.js layer reads the same value rather than keeping its own. WebGL is attempted only above 821px, without `prefers-reduced-motion`, at idle, and fails silently. Files: `src/components/RevealHero.astro`, `src/scripts/hero-reveal.ts`, `src/scripts/hero-webgl.ts`.
- **SMS estimate workflow.** The form validates in the browser and composes a text message the visitor reviews and sends from their own app. The site transmits and stores nothing. Files: `src/components/EstimateForm.astro`, `src/scripts/estimate-form.ts`, `src/lib/estimate/` (see its own `README.md` for the invariants).
- **Duncan service-area map.** `src/components/DuncanMap.astro` with `public/img/duncan-street-map.png`.
- **Mobile layout.** Below 820px the hero stacks and `src/components/MobileActionBar.astro` docks Call / Text / Estimate with 48px touch targets and safe-area padding.
- **Pricing.** Owner-supplied introductory prices in `src/data/services.ts`, presented with the $50 standalone minimum and the quote factors via `src/components/PricingNote.astro`.
- **Legal pages.** `/privacy` and `/terms` are written and live. Privacy describes the text-message workflow accurately: nothing is transmitted to the site, photos are not uploaded, no analytics or marketing cookies, no promotional messaging.

### Do not rebuild, redesign, or clean up

The logo, Duncan map, mobile layout, pricing, SMS estimate workflow, and desktop/mobile before-and-after slider are settled and in production. Change them only when the owner specifically asks. The comments in `src/scripts/hero-reveal.ts` and `src/lib/estimate/` record why the code is shaped the way it is — read them before assuming something is accidental.

## Rules that still bind every change

These came out of `BUSINESS_INPUTS.md` and remain in force. They are enforced in comments at the top of `src/data/business.ts`.

- **No credential of any kind exists.** No insurance, registration, licence, certification, training, or guarantee. The words *insured*, *bonded*, *verified*, *certified*, and *licensed* must not appear on the site.
- **No response-time promise has been set**, so none is published. Do not add "we reply within X".
- **No proof exists yet.** No real reviews, ratings, completed-project photos, owner story, or Google Business Profile. Never fabricate testimonials, ratings, job counts, years of experience, or before/after results.
- **No online booking.** Requests are confirmed by hand; nothing may imply instant booking or instant response.
- **Square-foot coverage limits and per-square-foot overages are not confirmed** and must not be published.
- **The concrete images are supplied placeholders**, shown unaltered and cropped rather than stretched. Nothing may claim they are SELI Wash Co. work.
- **Services are concrete flatwork only.** The `notOffered` list in `src/data/services.ts` is a deliberate, published "no" — do not soften it into a maybe.
- **Stain honesty stands.** Oil, rust, paint, gum, and deeply embedded stains are not guaranteed to come out. Chemical and specialty-treatment policy is still TBD, so no plant-safe, pet-safe, eco-friendly, or chemical-free claim may appear.
- **Consent is limited to contact about the requested estimate.** No promotional SMS consent.
- Anything genuinely undecided is typed as `null` with a TBD comment rather than filled with a plausible guess.

## Deployment and approval

- Every push to `main` publishes to production via `.github/workflows/deploy.yml`. There is no staging and no preview environment.
- Run `npm run verify` (`astro check && astro build`) and get 0 errors before pushing.
- **Do not commit, push, or deploy without the owner's explicit approval.** Show the diff first.
- `output/`, `scripts/`, and `tmp/` hold separate print-material work and are untracked. Do not delete, modify, or commit them unless the owner specifically asks.

## Still open — do not guess

- Response-time promise, lead time, cancellation policy, and weather policy. The site deliberately promises none of them.
- What chemicals or cleaning products are used, and the specialty-treatment policy for oil, rust, paint, and gum.
- Payment timing, deposits, discounts, late fees. (`pricing.paymentTiming`, `deposits`, and `discounts` are `null` in `src/data/business.ts`.)
- Whether Duncan or Stephens County requires a business registration or permit for this work, and whether sales tax is due on the service. No legal conclusion may be published until verified.
- The owner's story, and when a photo and real before/after pairs will exist.
- Whether automatic email delivery is ever added alongside the text route. If it is, it needs a provider account, a decision about where secrets live, real spam protection, and the Privacy and Terms pages updated to describe transmission and retention. Note that the current host serves static files only. See `src/lib/estimate/README.md`.
- `legal.privacyPolicy` and `legal.terms` are still `null` in `src/data/business.ts` even though both pages are written and live. Left as-is deliberately: the owner has not confirmed who authored or reviewed them.

---

# Historical planning record

**Everything below is a record of the concept and planning stage that ran before the site was built.** It is kept for continuity and for the reasoning behind decisions still in force. It describes a project that had not yet been implemented, so its instructions — "do not scaffold a framework", "still concept work", "Vercel is proposed", "no logo" — are **superseded** and must not be followed as current guidance. The business facts it records remain accurate unless `BUSINESS_INPUTS.md` says otherwise.

## Historical: collaboration roles

- **Codex:** product planning, scope, requirements, content structure, implementation review, and project continuity.
- **Claude:** frontend art direction, visual concepts, interaction design, and later frontend implementation after approval.
- **Owner:** business facts, brand decisions, content approval, and final choice among design directions.

## Historical: the concept file

The concept lived at `concepts/transformation-homepage.html`, with `concepts/transformation-homepage.standalone.html` generated from it by `concepts/build-standalone.ps1` (which inlined images as data URIs for publishing) and `concepts/resize-textures.ps1` regenerating web-sized textures from the originals in `concepts/assets/`.

The concept was a single self-contained page and deliberately not a starting codebase. As planned, the shipped site was built properly rather than grown out of that file. `concepts/` is now a historical artefact.

## Historical: what the owner decided before implementation

- The site is for **SELI Wash Co.**, a new pressure washing business in Duncan, Oklahoma.
- Homeowners are the primary audience; property managers and people responsible for driveways, parking areas, or sidewalks are also important.
- Required pages are Home, Services with pricing estimates, Gallery, About, and Contact.
- Required features include a quote-request form, before-and-after gallery, service-area map, reviews, and online booking or booking requests. *(Reviews and online booking were not built — neither exists. See the rules above.)*
- The style should be clean and professional.

### Decided during the concept review

- **Visual direction: Transformation** (direction 2 of the three explored). Deep navy base, white and cool grey space, a warm amber reserved for calls to action, and the wash front used as the recurring structural device.
- **Animation intensity: balanced.** One refined reveal moment in the hero, driven by the visitor, rather than an ambient or cinematic treatment.
- **Identity:** public name **SELI Wash Co.**, tagline **Pressure Washing & Exterior Cleaning**. No legal entity is registered — never append LLC or any other suffix. Palette confirmed as the existing navy, white/cool-grey, and amber. *(At the time: "No logo; a text wordmark stands in." A logo has since been made and shipped. The site tagline in `src/data/business.ts` is now "Concrete Cleaning in Duncan".)*
- **Contact:** **(580) 560-9673** (the owner's personal phone; texts allowed and preferred) and **0xseli.business@gmail.com**. Calls and texts answered **9am–11pm**; jobs run **Tuesday and Thursday, 9am–6pm**; weekends by request but **not guaranteed**.
- **Service area:** **Duncan, Oklahoma.** Outside Duncan by request, at **$5 per additional mile**.
- **Services are concrete flatwork only.** Core: driveways, sidewalks and walkways, patios and porches, steps and entry pads. Custom-quote: parking pads and aprons, recurring property care. Not offered and not advertised: roof washing, house or siding soft washing, gutters, fences, decks, sealing, joint-sand replacement, restoration, pavers, brick, pool decks, and any decorative, painted, coated, sealed, stamped, or fragile surface. Unusual surfaces are evaluated first and may be declined.
- **Stain honesty:** oil, rust, paint, gum, and deeply embedded stains are **not guaranteed** to come out. Chemical and specialty-treatment policy is TBD, so no plant-safe, pet-safe, eco-friendly, or chemical-free claim may appear.
- **Equipment is an electric pressure washer** with **25 ft of hose and a 25 ft cord**. The customer must supply an accessible outdoor spigot and a safe working outdoor **GFCI-protected** outlet within reach. These are stated plainly on the site and became qualifying questions in the estimate form. No technical electrical advice is given.
- **Introductory pricing (owner-supplied):** driveways from $100, sidewalks and walkways from $50, patios and porches from $80, steps and entry pads at $10 per step, parking pads and aprons quoted per site, recurring property care quoted per property. Estimates are free. Payment by cash, Cash App, PayPal, or Venmo.
- **A $50 minimum applies to standalone appointments.** Square-foot coverage limits and per-square-foot overages are **not confirmed and must not be published**.
- **No credentials of any kind exist.** The insurance card was removed from the concept entirely and was **not** replaced with uninsured marketing copy.
- **No proof exists yet.** Star ratings and sample testimonials were removed from the concept.
- **Hero imagery is used unaltered.** The owner supplied two concrete images, shown full-bleed and cropped to fit, never stretched, with nothing drawn, generated, or composited on top of them. They are concept placeholders and are **not** company work.
- **Quote requests are confirmed by hand.** No response-time promise is published, because none has been set.

## Historical: planning assumptions

- The name was settled but the brand system was not: no logo, and the domain was an unconfirmed idea. *(Both have since resolved: the logo shipped, and `seliwash.com` is purchased, owner-controlled, and live.)*
- Prices are owner-supplied introductory starting points, not quotes. Every price on the site must stay next to the $50 minimum and the factors that change it: size, buildup and staining, access, surface condition, specialty treatment, and travel. **Still in force.**
- The absence of credentials and proof is a fact to be respected, not a gap to be styled around. Where a competitor would put "licensed and insured," this site puts nothing. **Still in force.**
- Booking should be described as a request unless a real-time scheduling provider and confirmation workflow are selected. **Still in force.**
- Reviews, project photos, credentials, guarantees, and service claims must be real and approved before publication. **Still in force.**
- The launch experience should prioritize mobile visitors and quote conversion.
- 3D and motion are enhancements; all content and actions must remain usable without WebGL or animation. **Still in force** — this is why the hero has two layers.

## Historical: design exploration

Three homepage directions were proposed (Precision Clean, Transformation, Full Flow). The owner selected **Transformation** and a homepage concept was built for it, then revised across several rounds: the hero material moved from drawn CSS textures to the owner's supplied photographs, the service list narrowed to concrete flatwork, and owner-supplied pricing replaced the placeholders.

## Historical: implementation requirements set before the build

These were the conditions written for the build, and they describe what was then delivered:

- Build the five required pages with consistent navigation and clear conversion paths.
- Keep content, service data, pricing, reviews, FAQs, and service areas easy to update.
- Make forms accessible, validated, spam-resistant, privacy-conscious, and explicit about what happens after submission.
- Provide responsive image treatment and honest before-and-after labeling.
- Use progressive enhancement for three.js with a strong static fallback and reduced-motion behavior.
- Preserve search-friendly semantic content outside canvas elements.
- Test mobile, desktop, keyboard navigation, form states, reduced motion, no-WebGL fallback, and performance.
- Do not connect paid services, publish, or deploy without the owner's approval. **Still in force.**

## Historical: definition of ready to build

All six conditions were met and the owner gave the go-ahead. Hosting resolved to **GitHub Pages**; the form question resolved to the **no-provider SMS composer**, which is why no form provider was ever chosen.

## Historical: legal work required before public launch

- A basic Privacy policy appropriate to Oklahoma, covering the name, address, phone, and email the estimate form collects. — **Written and live at `/privacy`.**
- Basic Terms or service conditions. — **Written and live at `/terms`.**
- Consent language limited to being contacted **about the requested estimate**. No promotional SMS consent. — **Implemented; `legal.consentScope` in `src/data/business.ts`.**
- No legal conclusions about registration, permits, or sales tax until verified. — **Still in force; still unverified.**
