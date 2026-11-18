import { resolveDeployment } from './deployment';
import type { MediaSource } from '@/components/ui/Media.astro';
import type { BusinessSchemaPolicy } from '@/lib/seo/structured-data';

export const deployment = resolveDeployment(
  {
    PUBLIC_DEPLOYMENT_PROFILE:
      import.meta.env?.PUBLIC_DEPLOYMENT_PROFILE ??
      process.env.PUBLIC_DEPLOYMENT_PROFILE,
    PUBLIC_SITE_ORIGIN:
      import.meta.env?.PUBLIC_SITE_ORIGIN ?? process.env.PUBLIC_SITE_ORIGIN,
    VERCEL_ENV: process.env.VERCEL_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  },
  import.meta.env?.DEV ?? process.env.NODE_ENV !== 'production',
);

export const locales = ['ru', 'kk'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';
export const localeLabels: Record<Locale, string> = {
  ru: 'Русский',
  kk: 'Қазақша',
};
export function parseLocale(value: unknown): Locale {
  if (value === 'ru' || value === 'kk') return value;
  throw new Error(`Unsupported locale: ${String(value)}`);
}
export const themes = ['default', 'alternative', 'saya'] as const;
export type Theme = (typeof themes)[number];

export interface SiteConfig {
  name: string;
  url: string;
  defaultLocale: Locale;
  locales: readonly Locale[];
  theme: Theme;
  seo?: {
    themeColor?: string;
    defaultSocialImage?: MediaSource;
    titleSuffix?: string;
    business?: BusinessSchemaPolicy;
  };
}

export const siteConfig: SiteConfig = {
  name: 'SAYA QAM',
  url: deployment.origin,
  defaultLocale,
  locales,
  theme: 'saya',
  seo: {
    themeColor: '#153f3b',
    defaultSocialImage: {
      src: '/social-preview.png',
      alt: 'SAYA QAM — демонстрационный сайт / үлгі сайт',
      width: 1200,
      height: 630,
    },
  },
};
