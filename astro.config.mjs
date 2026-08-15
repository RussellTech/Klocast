import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://klocast.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [sitemap()],
});
