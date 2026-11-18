import type { BusinessInfo } from '@/content/models';
import { requiredText, normalizeOpeningHours } from '@/content/normalize';
import { httpHref, emailHref, phoneHref } from '@/lib/contact';
import { validateOrigin } from '@/config/deployment';

export const businessTypes = [
  'Organization',
  'LocalBusiness',
  'MedicalClinic',
  'ProfessionalService',
  'HomeAndConstructionBusiness',
] as const;
export interface BusinessSchemaPolicy {
  verified: true;
  type: (typeof businessTypes)[number];
  logo?: string;
  sameAs?: readonly string[];
  areaServed?: string;
}
export interface StructuredData {
  '@context': 'https://schema.org';
  '@type': string;
  [key: string]: unknown;
}
function url(value: string): string {
  const result = httpHref(value);
  if (!result) throw new Error(`Invalid structured data URL: ${value}`);
  return result;
}

export function businessSchema(
  business: BusinessInfo,
  origin: string,
  policy: BusinessSchemaPolicy,
): StructuredData {
  if (policy.verified !== true || !businessTypes.includes(policy.type))
    throw new Error(
      'Structured business data requires verification and a supported schema type',
    );
  const official = validateOrigin(origin, true);
  const details = business.details;
  if (details.email && !emailHref(details.email))
    throw new Error('Invalid structured business email');
  if (details.phone && !phoneHref(details.phone.number))
    throw new Error('Invalid structured business phone');
  return {
    '@context': 'https://schema.org',
    '@type': policy.type,
    '@id': `${official}/#organization`,
    url: `${official}/`,
    name: requiredText(business.name, 'structured business name'),
    ...(details.email ? { email: details.email } : {}),
    ...(details.phone ? { telephone: details.phone.number } : {}),
    ...(details.address
      ? { address: requiredText(details.address, 'structured address') }
      : {}),
    ...(policy.logo ? { logo: url(policy.logo) } : {}),
    ...(policy.sameAs?.length ? { sameAs: policy.sameAs.map(url) } : {}),
    ...(policy.areaServed
      ? { areaServed: requiredText(policy.areaServed, 'service area') }
      : {}),
    ...(policy.type !== 'Organization' && business.openingHours
      ? { openingHours: normalizeOpeningHours(business.openingHours) }
      : {}),
    // Display-localized hours are not Schema.org openingHours syntax; do not guess.
  };
}

export function breadcrumbSchema(
  items: readonly { label: string; href: string }[],
): StructuredData {
  if (!items.length) throw new Error('Breadcrumbs require at least one item');
  const seen = new Set<string>();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const href = url(item.href);
      if (seen.has(href)) throw new Error(`Duplicate breadcrumb URL: ${href}`);
      seen.add(href);
      return {
        '@type': 'ListItem',
        position: index + 1,
        name: requiredText(item.label, 'breadcrumb label'),
        item: href,
      };
    }),
  };
}

export function serializeStructuredData(
  data: readonly StructuredData[],
): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
