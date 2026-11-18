import { locales, parseLocale, type Locale } from '@/config/site';
import { localizedPath, type PageId } from '@/i18n/routes';
import { t } from '@/i18n/translations';
import { emailHref, httpHref, phoneHref } from '@/lib/contact';
import { whatsappHref, telegramHref } from '@/lib/business/actions';
import type { MediaSource } from '@/components/ui/Media.astro';
import type {
  BusinessInfo,
  BusinessSource,
  FieldServiceSource,
  Localized,
  PageContent,
  PageEntry,
  ResolvedService,
  ServiceEntry,
} from './models';

export function requiredText(value: unknown, context: string): string {
  if (typeof value !== 'string' || !value.trim())
    throw new Error(`Missing required text: ${context}`);
  return value.trim();
}
export function normalizeOpeningHours(values: readonly string[]): string[] {
  const day = '(?:Mo|Tu|We|Th|Fr|Sa|Su)';
  const time = '(?:[01]\\d|2[0-3]):[0-5]\\d';
  const syntax = new RegExp(
    `^${day}(?:-${day})?(?:,${day}(?:-${day})?)* ${time}-${time}$`,
  );
  if (
    !values.length ||
    values.some((value) => typeof value !== 'string' || !syntax.test(value))
  )
    throw new Error(
      'Invalid business openingHours; use Schema.org day/time ranges such as Mo-Fr 09:00-18:00',
    );
  return [...values];
}
export function localizedText(
  value: Partial<Localized<string>>,
  locale: Locale,
  context: string,
): string {
  parseLocale(locale);
  for (const key of Object.keys(value)) parseLocale(key);
  // A published record must be complete even when resolving its Russian version.
  for (const language of locales)
    requiredText(value[language], `${context}/${language}`);
  return requiredText(value[locale], `${context}/${locale}`);
}
function optionalText(value: string | undefined, context: string) {
  return value === undefined ? undefined : requiredText(value, context);
}
function optionalLocalized(
  value: Partial<Localized<string>> | undefined,
  locale: Locale,
  context: string,
) {
  if (!value) return undefined;
  for (const key of Object.keys(value)) parseLocale(key);
  for (const [key, text] of Object.entries(value))
    requiredText(text, `${context}/${key}`);
  return value[locale]; // No implicit business-content fallback.
}
export function normalizeMedia(
  media: MediaSource,
  context: string,
): MediaSource {
  if (
    typeof media.alt !== 'string' ||
    !Number.isFinite(media.width) ||
    media.width <= 0 ||
    !Number.isFinite(media.height) ||
    media.height <= 0
  )
    throw new Error(`Invalid media metadata: ${context}`);
  if (typeof media.src === 'string') {
    if (
      !(media.src.startsWith('/') && !media.src.startsWith('//')) &&
      !httpHref(media.src)
    )
      throw new Error(`Invalid media URL: ${context}`);
  } else if (
    !media.src ||
    !media.src.src ||
    media.src.width <= 0 ||
    media.src.height <= 0
  )
    throw new Error(`Invalid local media: ${context}`);
  return {
    src: media.src,
    alt: media.alt,
    width: media.width,
    height: media.height,
  };
}
export function resolveBusiness(
  source: BusinessSource,
  locale: Locale,
): BusinessInfo {
  const id = requiredText(source.id, 'business.id');
  if (!emailHref(source.email))
    throw new Error(`Invalid email: business/${id}`);
  if (
    source.phone &&
    (!source.phone.text.trim() || !phoneHref(source.phone.number))
  )
    throw new Error(`Invalid phone: business/${id}`);
  if (source.messengers?.whatsapp && !whatsappHref(source.messengers.whatsapp))
    throw new Error(`Invalid WhatsApp: business/${id}`);
  if (source.messengers?.telegram && !telegramHref(source.messengers.telegram))
    throw new Error(`Invalid Telegram: business/${id}`);
  if (source.bookingUrl && !httpHref(source.bookingUrl))
    throw new Error(`Invalid booking URL: business/${id}`);
  for (const link of source.social ?? [])
    if (!link.label.trim() || !httpHref(link.href))
      throw new Error(`Invalid social link: business/${id}`);
  return {
    id,
    name: localizedText(source.name, locale, `${id}.name`),
    description: localizedText(source.description, locale, `${id}.description`),
    ...(source.openingHours
      ? { openingHours: normalizeOpeningHours(source.openingHours) }
      : {}),
    details: {
      email: source.email,
      ...(source.phone ? { phone: { ...source.phone } } : {}),
      ...(source.messengers ? { messengers: { ...source.messengers } } : {}),
      ...(source.bookingUrl ? { bookingUrl: source.bookingUrl } : {}),
      ...(source.social
        ? { social: source.social.map((link) => ({ ...link })) }
        : {}),
      address: optionalLocalized(source.address, locale, `${id}.address`),
      hours: optionalLocalized(source.hours, locale, `${id}.hours`),
    },
  };
}
export function resolveService(
  source: ServiceEntry,
  locale: Locale,
): ResolvedService {
  if (parseLocale(source.locale) !== parseLocale(locale))
    throw new Error(`Locale mismatch: service/${source.id}/${locale}`);
  const id = requiredText(source.id, 'service.id');
  const href = source.destination && localizedPath(source.destination, locale);
  if (source.destination && !href)
    throw new Error(`Unresolved service route: ${id}/${source.destination}`);
  return {
    id,
    title: requiredText(source.title, `${id}.title/${locale}`),
    description: requiredText(
      source.description,
      `${id}.description/${locale}`,
    ),
    ...(source.media
      ? { media: normalizeMedia(source.media, `service/${id}/${locale}`) }
      : {}),
    ...(href ? { link: { label: t(locale, 'nav.services'), href } } : {}),
    ...(source.metadata !== undefined
      ? { metadata: optionalText(source.metadata, `${id}.metadata`) }
      : {}),
  };
}
export function resolveFieldService(
  source: FieldServiceSource,
  locale: Locale,
): ResolvedService {
  return resolveService(
    {
      id: source.id,
      locale,
      title: localizedText(source.title, locale, `${source.id}.title`),
      description: localizedText(
        source.description,
        locale,
        `${source.id}.description`,
      ),
      media: source.media?.[locale],
      destination: source.destination,
      metadata: optionalLocalized(
        source.metadata,
        locale,
        `${source.id}.metadata`,
      ),
    },
    locale,
  );
}
export function validateEntries<T extends { id: string; locale: Locale }>(
  entries: readonly T[],
  scope: string,
): void {
  const pairs = new Set<string>();
  const ids = new Set<string>();
  for (const entry of entries) {
    const id = requiredText(entry.id, `${scope}.id`);
    const locale = parseLocale(entry.locale);
    const key = `${id}/${locale}`;
    if (pairs.has(key)) throw new Error(`Duplicate ${scope} ID/locale: ${key}`);
    pairs.add(key);
    ids.add(id);
  }
  for (const id of ids)
    for (const locale of locales)
      if (!pairs.has(`${id}/${locale}`))
        throw new Error(
          `Missing required ${scope} translation: ${id}/${locale}`,
        );
}
export function resolvePage(source: PageEntry): PageContent {
  const locale = parseLocale(source.locale);
  if (!localizedPath(source.id, locale))
    throw new Error(`Unresolved page: ${source.id}/${locale}`);
  const text = (value: unknown, field: string) =>
    requiredText(value, `page/${source.id}/${locale}/${field}`);
  if (typeof source.metadata.indexable !== 'boolean')
    throw new Error(`Invalid indexing eligibility: ${source.id}/${locale}`);
  return {
    id: source.id,
    metadata: {
      title: text(source.metadata.title, 'metadata.title'),
      description: text(source.metadata.description, 'metadata.description'),
      indexable: source.metadata.indexable,
      ...(source.metadata.socialImage
        ? {
            socialImage: normalizeMedia(
              source.metadata.socialImage,
              `${source.id}.socialImage`,
            ),
          }
        : {}),
    },
    hero: {
      title: text(source.hero.title, 'hero.title'),
      description: text(source.hero.description, 'hero.description'),
      eyebrow: optionalText(source.hero.eyebrow, `${source.id}.eyebrow`),
    },
    servicesTitle: text(source.servicesTitle, 'servicesTitle'),
    about: {
      title: text(source.about.title, 'about.title'),
      description: text(source.about.description, 'about.description'),
    },
    cta: {
      title: text(source.cta.title, 'cta.title'),
      description: text(source.cta.description, 'cta.description'),
    },
  };
}
export function resolveNavigation(
  ids: readonly PageId[],
  locale: Locale,
  current: PageId,
) {
  if (new Set(ids).size !== ids.length)
    throw new Error('Duplicate navigation route ID');
  return ids.map((id) => {
    const href = localizedPath(id, locale);
    if (!href) throw new Error(`Unresolved navigation route: ${id}/${locale}`);
    return {
      label: t(locale, id === 'home' ? 'nav.home' : 'nav.services'),
      href,
      current: id === current,
    };
  });
}
