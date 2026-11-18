import { siteConfig, deployment, type Locale } from '@/config/site';
import { robotsDirective, type DeploymentConfig } from '@/config/deployment';
import {
  availableTranslations,
  type PageId,
  type RouteDefinition,
} from '@/i18n/routes';
import type { PageContent } from '@/content/models';
import { normalizeMedia, requiredText } from '@/content/normalize';
import { httpHref } from '@/lib/contact';
import type { MediaSource } from '@/components/ui/Media.astro';
import type { StructuredData } from './structured-data';

export interface SEOData {
  title: string;
  description?: string;
  canonical?: string;
  robots: string;
  locale: Locale;
  alternates: readonly { locale: Locale; href: string }[];
  image?: { url: string; alt: string; width: number; height: number };
  structuredData?: readonly StructuredData[];
}

export function absoluteUrl(value: string, origin: string): string {
  const url =
    value.startsWith('/') && !value.startsWith('//')
      ? new URL(value, origin).href
      : httpHref(value);
  if (!url) throw new Error(`Invalid SEO URL: ${value}`);
  return url;
}

export function socialImage(media: MediaSource | undefined, origin: string) {
  if (!media) return undefined;
  const image = normalizeMedia(media, 'SEO social image');
  return {
    url: absoluteUrl(
      typeof image.src === 'string' ? image.src : image.src.src,
      origin,
    ),
    alt: image.alt,
    width: image.width,
    height: image.height,
  };
}

export function canonicalUrl(path: string, origin: string): string {
  const url = new URL(absoluteUrl(path, origin));
  if (
    url.origin !== origin ||
    url.search ||
    url.hash ||
    !url.pathname.endsWith('/')
  )
    throw new Error(
      `Canonical must use the deployment origin, trailing slash, and no query or fragment: ${path}`,
    );
  return url.href;
}

// The caller supplies the existing normalized content boundary, never raw records.
export function resolvePageSEO(
  page: PageContent,
  locale: Locale,
  getPage: (id: PageId, locale: Locale) => PageContent,
  policy: DeploymentConfig = deployment,
  records?: readonly RouteDefinition[],
): SEOData {
  const translations = availableTranslations(page.id, records);
  const current = translations.find((entry) => entry.locale === locale);
  if (!current) throw new Error(`No canonical route for ${page.id}/${locale}`);
  const title = requiredText(
    page.metadata.title,
    `${page.id}/${locale}/SEO title`,
  );
  const description = requiredText(
    page.metadata.description,
    `${page.id}/${locale}/SEO description`,
  );
  const eligible = translations.filter(
    (entry) => getPage(page.id, entry.locale).metadata.indexable,
  );
  return {
    title: siteConfig.seo?.titleSuffix
      ? `${title} ${siteConfig.seo.titleSuffix}`
      : title,
    description,
    locale,
    canonical: canonicalUrl(current.href, policy.origin),
    robots: robotsDirective(policy, page.metadata.indexable),
    // A noindexed page must not advertise itself or an asymmetric alternate set.
    alternates:
      policy.profile === 'production' && page.metadata.indexable
        ? eligible.map((entry) => ({
            locale: entry.locale,
            href: canonicalUrl(entry.href, policy.origin),
          }))
        : [],
    image: socialImage(
      page.metadata.socialImage ?? siteConfig.seo?.defaultSocialImage,
      policy.origin,
    ),
  };
}
