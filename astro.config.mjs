import sitemap from '@astrojs/sitemap';
import { defineConfig, passthroughImageService } from 'astro/config';

// The site is intentionally static: the estimate flow composes an SMS on the
// visitor's device and does not require a server or form provider.
export default defineConfig({
  output: 'static',
  site: 'https://seliwash.com',
  integrations: [sitemap()],

  // The concrete images are pre-sized in public/. Nothing goes through
  // astro:assets, so skip the sharp pipeline entirely.
  image: {
    service: passthroughImageService(),
  },

  build: {
    inlineStylesheets: 'auto',
  },

  devToolbar: {
    enabled: false,
  },
});
