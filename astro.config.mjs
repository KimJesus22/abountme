import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://abountme-beta.vercel.app',
  integrations: [tailwind(), sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es', 'ko', 'ja'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
