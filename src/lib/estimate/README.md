# Estimate request composer

The estimate form validates in the browser and then builds a text message the
visitor reviews and sends from their own messaging app. This is the intended
workflow, chosen because texting is the owner's preferred channel.

## What that means in practice

- **The site transmits nothing.** No endpoint, no upload, no server-side copy of
  anyone's answers. Everything stays in the page until the visitor opens their
  messaging app.
- **Photos are attached by the visitor.** The file input exists so people can
  pick images while they are thinking about the job; the filenames are carried
  into the message as a checklist. The bytes never leave the browser.
- **The business receives the request only when the visitor sends the text.**
  No code path may claim otherwise — see the invariants in `types.ts`.

## Structure

- `types.ts` — `EstimatePayload`, `ComposeResult`, `RequestComposer`, and the
  invariants the rest of the code relies on.
- `sms-composer.ts` — builds the `sms:` URL and the human-readable body. Also
  guards against over-long URLs, which some platforms silently truncate.
- `index.ts` — exports the active composer.

## If automatic email delivery is added later

The owner has not decided whether they want it. If they do, the shape to add is
a second `RequestComposer`-like path that posts to a provider, alongside — not
instead of — the text route, since some visitors will prefer texting anyway.
That work would need: a provider account, a decision about where secrets live
(a secret key means a server route and the Vercel adapter), real spam
protection, and the Privacy and Terms pages updated to describe transmission and
retention. Until then, nothing in the UI should imply email delivery exists.
