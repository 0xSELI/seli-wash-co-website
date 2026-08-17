# Pressure Washing Company Website — Design Direction

## Design status

This document defines the initial creative direction only. It is not approval to build. Visual concepts should be explored and reviewed before frontend implementation begins.

## Desired impression

Clean, professional, capable, and local. The experience should feel as satisfying as seeing a dirty surface become clean, while remaining credible enough for homeowners and property managers to trust with their property.

## Creative concept

Use a **clean-surface transformation** theme: crisp contrast, generous space, strong photography, and restrained motion that reveals improvement. Avoid a generic blue-water template, cartoon splashes, excessive shine effects, or animation that makes the business feel less dependable.

## Provisional visual system

These choices are starting points, not final brand decisions.

- **Color:** deep navy or charcoal for trust; clean white and cool light gray for space; a fresh blue or teal accent for water and action; an optional warm accent used sparingly for calls to action.
- **Typography:** a sturdy, highly legible sans serif for headings paired with a neutral sans serif for body copy. Use fonts that load quickly and remain readable on small screens.
- **Photography:** real, high-resolution before-and-after images with consistent lighting and honest editing. Show recognizable surfaces and careful professional work.
- **Shape and spacing:** crisp grids, comfortable spacing, moderate corner radius, and subtle depth. The result should feel polished rather than overly glossy.
- **Icons:** one consistent, accessible icon family. Do not use emoji as interface icons.

## Animation strategy

The site should support three possible animation intensities so the owner can compare them later:

### Light

- Subtle fades and short content reveals.
- Gentle image comparison interactions.
- Minimal three.js use, limited to one small hero enhancement or omitted on low-power devices.

### Balanced — recommended starting point

- A smooth three.js hero scene inspired by clean surfaces, water movement, or the transition from dirty to clean.
- Controlled scroll-linked transitions between a few major sections.
- Before-and-after comparisons as the main interactive proof.
- Standard UI interactions remain immediate and familiar.

### Immersive

- A more cinematic three.js hero and richer scene transitions.
- Stronger depth, parallax, and transformation moments.
- Use only if testing shows that the experience stays fast, understandable, and conversion-focused.

All directions must provide a complete reduced-motion experience, preserve content without WebGL, avoid scroll hijacking, and pause costly effects when they are off screen. Animation should never interfere with navigation, forms, pricing information, calls, or booking.

## Page-level direction

### Home

1. Compact header with logo, primary navigation, phone action, and **Get a Free Estimate** button.
2. Hero with a clear local value proposition, primary quote action, secondary gallery action, and a purposeful three.js or photographic transformation moment.
3. Trust strip for factual details only: service area, work days, preferred contact, and what the customer must provide on site. No credentials, because none exist, and no response time, because none has been set.
4. Common services in scannable cards.
5. Featured before-and-after comparison.
6. Three-step process: request, confirm, refresh.
7. Reviews block — only once real reviews exist. Until then it states plainly that the business is new.
8. Service-area preview.
9. FAQ preview and final call to action.

### Services and pricing estimates

- Start with a short explanation of how estimates work.
- Use clear service sections or cards with typical scope, suitable surfaces, estimate range, and quote action.
- Keep disclaimer text close to every price or range.
- Give property managers a distinct recurring-service inquiry path without displacing homeowner content.

### Gallery

- Let the work dominate the page.
- Pair each before image with its matching after image.
- Use accessible sliders or side-by-side comparisons with labels, keyboard operation, and a non-interactive fallback.
- Add filters only when there are enough real projects to make them useful.

### About

- Lead with a real owner or team photo and a concise personal story.
- Balance friendly local character with professional standards.
- Use verified trust details and a direct route to request a quote.

### Contact

- Put the quote form first on mobile.
- Break the form into a small number of logical groups and explain optional photo upload.
- Show phone (call and text), email, answering hours, work days, service area, and the spigot/GFCI requirement nearby. No response-time promise and no booking widget.
- Provide specific success, validation, upload, and failure messages.

## Responsive behavior

- Design mobile-first because urgent local-service searches often happen on phones.
- Keep the main call or estimate action easy to reach without covering content.
- Use large touch targets and readable pricing tables that do not require horizontal scrolling.
- Replace or simplify heavy three.js effects on smaller screens and constrained devices.
- Keep forms short, autofill-friendly, and easy to resume after an error.

## Accessibility and motion requirements

- Meet WCAG 2.2 AA expectations for color contrast, focus, keyboard use, labels, error identification, and meaningful alternatives.
- Honor `prefers-reduced-motion` and include a visible motion-reduction control if the immersive direction is selected.
- Do not place essential text inside canvas content.
- Give gallery images descriptive alternative text based on the actual project.
- Test zoom, screen-reader announcements, keyboard navigation, and touch interaction.

## Performance guardrails

- Prioritize the first meaningful content and primary call to action over the three.js scene.
- Load 3D assets only where needed and use compressed, appropriately sized assets.
- Provide a strong static poster or image fallback.
- Avoid autoplay video backgrounds unless there is a compelling, tested reason.
- Set measurable performance budgets during implementation, then test on mid-range mobile hardware and a slower connection.

## Visual exploration requested before implementation

Claude should prepare three clearly different homepage concepts using the same approved content:

1. **Precision Clean:** minimal, confident, and lightly animated.
2. **Transformation:** a balanced direction centered on before-and-after proof and one refined three.js moment.
3. **Full Flow:** immersive and highly animated, while retaining a clear quote path and accessible fallback.

The owner should choose one direction or combine specific elements before code is written.

## Design decisions still open

- Final brand name, logo, tagline, and palette.
- Light, balanced, or immersive animation intensity.
- Exact hero concept and whether it uses real photography, 3D, or both.
- Final fonts and icon family.
- Form provider and spam protection. There is no booking experience to design: requests are confirmed by hand.
- Whether pricing is shown as starting prices, ranges, or quote-only guidance.
- Gallery filtering and comparison style based on the available photos.
