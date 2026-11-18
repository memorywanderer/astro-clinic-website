import { locales, parseLocale, type Locale } from '@/config/site';
import type { PageId } from '@/i18n/routes';
import { business, pages, services } from './data/business';
import {
  resolveBusiness,
  resolveNavigation,
  resolvePage,
  resolveService,
  validateEntries,
} from './normalize';

// Validate the complete authored dataset, including records not selected by a preview.
validateEntries(services, 'service');
validateEntries(pages, 'page');
for (const locale of locales) resolveBusiness(business, locale);
for (const entry of services) resolveService(entry, entry.locale);
for (const entry of pages) resolvePage(entry);

export function getBusinessInfo(locale: Locale) {
  return resolveBusiness(business, parseLocale(locale));
}
export function getServices(locale: Locale) {
  parseLocale(locale);
  return services
    .filter((entry) => entry.locale === locale)
    .map((entry) => resolveService(entry, locale));
}
export function getNavigation(locale: Locale, current: PageId) {
  return resolveNavigation(['home', 'services'], parseLocale(locale), current);
}
export function getPage(id: PageId, locale: Locale) {
  parseLocale(locale);
  const source = pages.find(
    (entry) => entry.id === id && entry.locale === locale,
  );
  if (!source) throw new Error(`Missing page content: ${id}/${locale}`);
  return resolvePage(source);
}
