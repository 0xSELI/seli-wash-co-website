# SELI Wash Co. Website — Codex-to-Claude Handoff

## Current status: visual direction approved and business facts supplied, still stop before implementation

The owner has selected a visual direction and a homepage concept has been built and reviewed. The project is still in the concept stage. Do not scaffold a framework, install packages, create website code beyond the concept file, generate final assets, or deploy anything until the owner explicitly asks for implementation.

The concept lives at `concepts/transformation-homepage.html`. It uses relative asset paths and is the file to edit. `concepts/transformation-homepage.standalone.html` is generated from it by `concepts/build-standalone.ps1`, which inlines the images as data URIs for publishing; do not hand-edit the standalone copy. `concepts/resize-textures.ps1` regenerates the web-sized textures from the originals in `concepts/assets/`.

## Collaboration roles

- **Codex:** product planning, scope, requirements, content structure, implementation review, and project continuity.
- **Claude:** frontend art direction, visual concepts, interaction design, and later frontend implementation after approval.
- **Owner:** business facts, brand decisions, content approval, and final choice among design directions.

## Read first

1. `BUSINESS_INPUTS.md` for the owner's supplied facts and every remaining TBD. **This is the authority on business facts.** Nothing may be published that contradicts it, and nothing marked TBD may be guessed.
2. `PROJECT_BRIEF.md` for the audience, pages, features, launch scope, and business unknowns.
3. `DESIGN.md` for the visual direction, three animation levels, responsive behavior, accessibility, and performance guardrails.
4. This file for workflow boundaries and the next handoff step.

If documents conflict, pause and ask the owner rather than silently choosing.

## What the owner has already decided

- The site is for **SELI Wash Co.**, a new pressure washing business in Duncan, Oklahoma.
- Homeowners are the primary audience; property managers and people responsible for driveways, parking areas, or sidewalks are also important.
- Required pages are Home, Services with pricing estimates, Gallery, About, and Contact.
- Required features include a quote-request form, before-and-after gallery, service-area map, reviews, and online booking or booking requests.
- The style should be clean and professional.

### Decided during the concept review

- **Visual direction: Transformation** (direction 2 of the three explored). Deep navy base, white and cool grey space, a warm amber reserved for calls to action, and the wash front used as the recurring structural device.
- **Animation intensity: balanced.** One refined reveal moment in the hero, driven by the visitor, rather than an ambient or cinematic treatment.
- **Identity:** public name **SELI Wash Co.**, tagline **Pressure Washing & Exterior Cleaning**. No legal entity is registered — never append LLC or any other suffix. No logo; a text wordmark stands in. Palette confirmed as the existing navy, white/cool-grey, and amber.
- **Contact:** **(580) 560-9673** (the owner's personal phone; texts allowed and preferred) and **0xseli.business@gmail.com**. Calls and texts answered **9am–11pm**; jobs run **Tuesday and Thursday, 9am–6pm**; weekends by request but **not guaranteed**.
- **Service area:** **Duncan, Oklahoma.** Outside Duncan by request, at **$5 per additional mile**.
- **Services are concrete flatwork only.** Core: driveways, sidewalks and walkways, patios and porches, steps and entry pads. Custom-quote: parking pads and aprons, recurring property care. Not offered and not advertised: roof washing, house or siding soft washing, gutters, fences, decks, sealing, joint-sand replacement, restoration, pavers, brick, pool decks, and any decorative, painted, coated, sealed, stamped, or fragile surface. Unusual surfaces are evaluated first and may be declined.
- **Stain honesty:** oil, rust, paint, gum, and deeply embedded stains are **not guaranteed** to come out. Chemical and specialty-treatment policy is TBD, so no plant-safe, pet-safe, eco-friendly, or chemical-free claim may appear.
- **Equipment is an electric pressure washer** with **25 ft of hose and a 25 ft cord**. The customer must supply an accessible outdoor spigot and a safe working outdoor **GFCI-protected** outlet within reach. These are stated plainly on the site and must become qualifying questions in the estimate form. No technical electrical advice is given.
- **Introductory pricing (owner-supplied):** driveways from $100, sidewalks and walkways from $50, patios and porches from $80, steps and entry pads at $10 per step, parking pads and aprons quoted per site, recurring property care quoted per property. Estimates are free. Payment by cash, Cash App, PayPal, or Venmo.
- **A $50 minimum applies to standalone appointments.** Square-foot coverage limits and per-square-foot overages are **not confirmed and must not be published**.
- **No credentials of any kind exist.** No insurance, registration, licence, certification, training, or guarantee. The insurance card has been removed from the site entirely and was **not** replaced with uninsured marketing copy. The words insured, bonded, verified, certified, and licensed must not appear.
- **No proof exists yet.** No real photos, reviews, ratings, owner story, or Google Business Profile. Star ratings and sample testimonials were removed. Never fabricate testimonials, ratings, job counts, years of experience, customer logos, or before/after results.
- **Hero imagery is used unaltered.** The owner supplied two concrete images. They are shown full-bleed and cropped to fit, never stretched, with nothing drawn, generated, or composited on top of them. They are labelled as concept placeholders and are **not** company work.
- **Quote requests are confirmed by hand.** Nothing may imply instant booking or instant response. No response-time promise is published, because none has been set.

## Planning assumptions to preserve

- The name is settled but the brand system is not: no logo, and the domain is an unconfirmed idea. The palette is confirmed.
- Prices are owner-supplied introductory starting points, not quotes. Every price on the site must stay next to the $50 minimum and the factors that change it: size, buildup and staining, access, surface condition, specialty treatment, and travel.
- The absence of credentials and proof is a fact to be respected, not a gap to be styled around. Where a competitor would put "licensed and insured," this site puts nothing.
- Booking should be described as a request unless a real-time scheduling provider and confirmation workflow are selected.
- Reviews, project photos, credentials, guarantees, and service claims must be real and approved before publication.
- The launch experience should prioritize mobile visitors and quote conversion.
- 3D and motion are enhancements; all content and actions must remain usable without WebGL or animation.

## Completed — design exploration

Three homepage directions were proposed (Precision Clean, Transformation, Full Flow). The owner selected **Transformation** and a homepage concept was built for it, then revised across several rounds: the hero material moved from drawn CSS textures to the owner's supplied photographs, the service list narrowed to concrete flatwork, and owner-supplied pricing replaced the placeholders.

## Next assignment for Claude — still concept work

Continue refining `concepts/transformation-homepage.html` on request. Do not start the real site. In particular, do not scaffold a framework because the concept looks finished.

The concept is a single self-contained page and deliberately not a starting codebase. When implementation is authorised, the five required pages should be built properly rather than grown out of this file.

## Questions Claude should not guess

The answers supplied so far, and everything still open, live in `BUSINESS_INPUTS.md`. Still unresolved and not to be guessed:

- Is `seliwash.com` actually purchased, and is it in the owner's own account?
- Which host, form provider, and spam protection will be used, and who owns those accounts?
- What is the response-time promise, lead time, cancellation policy, and weather policy? The site currently promises none of them, deliberately.
- What chemicals or cleaning products are used, and what is the specialty-treatment policy for oil, rust, paint, and gum?
- Payment timing, deposits, discounts, late fees.
- Does Duncan or Stephens County require a business registration or permit for this work, and is sales tax due on the service?
- Who writes the Privacy policy and Terms pages?
- What is the owner's story, and when will a photo and real before/after pairs exist?

Claude may use clearly marked concept placeholders, but must not present invented business details as facts, and must not soften a "no" from `BUSINESS_INPUTS.md` into a maybe.

Claude may use clearly marked sample copy in concepts, but it must not present invented business details as facts.

## Later implementation requirements

After a visual direction is approved and implementation is explicitly requested:

- Build the five required pages with consistent navigation and clear conversion paths.
- Keep content, service data, pricing, reviews, FAQs, and service areas easy to update.
- Make forms accessible, validated, spam-resistant, privacy-conscious, and explicit about what happens after submission.
- Provide responsive image treatment and honest before-and-after labeling.
- Use progressive enhancement for three.js with a strong static fallback and reduced-motion behavior.
- Preserve search-friendly semantic content outside canvas elements.
- Test mobile, desktop, keyboard navigation, form states, reduced motion, no-WebGL fallback, and performance.
- Do not connect paid services, publish, or deploy without the owner's approval.

## Definition of ready to build

Implementation can begin when the owner has:

- ~~selected a visual direction and animation intensity~~ — **done:** Transformation, balanced.
- ~~approved the initial content hierarchy~~ — **done:** reviewed in the homepage concept.
- ~~approved the launch services and pricing approach~~ — **done:** concrete flatwork, introductory prices, $50 standalone minimum.
- ~~supplied or approved the core brand and business information~~ — **substantially done:** name, tagline, phone, email, hours, service area, and palette are all in. Logo and domain control remain open.
- chosen the quote, booking, and hosting approach — **outstanding.** Vercel is proposed; nothing is confirmed and no form provider is chosen.
- explicitly asked Claude or Codex to build the website — **outstanding.**

Four of six conditions are met. The two that remain are the hosting/form decision and the owner's explicit go-ahead. Until both land, keep all work at the planning and visual-concept stage.

## Legal work required before public launch

Not optional, and not something to launch without:

- A basic Privacy policy appropriate to Oklahoma, covering the name, address, phone, and email the estimate form collects.
- Basic Terms or service conditions.
- Consent language limited to being contacted **about the requested estimate**. No promotional SMS consent.
- No legal conclusions about registration, permits, or sales tax until verified.
