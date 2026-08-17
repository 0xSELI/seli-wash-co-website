# SELI Wash Co. website

Production website for SELI Wash Co., a concrete flatwork pressure-washing business serving Duncan, Oklahoma.

## Stack

- Astro static site
- TypeScript
- Three.js for the interactive wash-line hero
- Cloudflare Pages for hosting

## Local development

```powershell
npm install
npm run dev
```

Run the complete production check before publishing:

```powershell
npm run verify
```

The generated site is written to `dist/`.

## Deployment

Cloudflare Pages should use:

- Production branch: `main`
- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js version: `22.16.0` (from `.nvmrc`)

The canonical production URL is `https://seliwash.com`.

## Estimate workflow

The estimate form does not send data to a server. It validates the visitor's answers, composes a text message addressed to SELI Wash Co., and opens the visitor's messaging app. The visitor sends the message and attaches any photos from that app.

## Business content

Verified business facts live in `src/data/business.ts`. Do not add reviews, credentials, completed-project photos, guarantees, or operating promises unless the business can support them.
