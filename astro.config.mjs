import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import process from 'node:process';
// @ts-check
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site';
import { loadEnv } from 'vite';
import { resolveDeployment } from './src/config/deployment';
import { productionSitemap } from './src/lib/seo/sitemap';

const deployment = resolveDeployment(
  {
    ...loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_'),
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  process.env.NODE_ENV !== 'production',
);

// https://astro.build/config
export default defineConfig({
  site: deployment.origin,
  integrations:
    deployment.profile === 'production' ? [productionSitemap()] : [],
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: siteConfig.defaultLocale,
    locales: [...siteConfig.locales],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss(), Icons({ compiler: 'astro', scale: 1 })],
    // Discover both runtime entry points before browsers visit different dev routes.
    optimizeDeps: {
      include: [
        '@starwind-ui/runtime/button',
        '@starwind-ui/runtime/collapsible',
      ],
    },
  },
});
