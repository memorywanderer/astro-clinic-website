import { getRelativeLocaleUrl } from 'astro:i18n';
import { locales, parseLocale, type Locale } from '@/config/site';

export interface RouteDefinition {
  id: string;
  paths: Partial<Record<Locale, string>>;
  missing?: 'redirect-ru' | '404';
}
export const routes = [
  { id: 'home', paths: { ru: '', kk: '' } },
  { id: 'services', paths: { ru: 'services', kk: 'services' } },
] as const satisfies readonly RouteDefinition[];
export type PageId = (typeof routes)[number]['id'];

export function validateRoutes(records: readonly RouteDefinition[]): void {
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const record of records) {
    if (!record.id.trim() || ids.has(record.id))
      throw new Error(`Duplicate/empty route ID: ${record.id}`);
    ids.add(record.id);
    for (const [key, path] of Object.entries(record.paths)) {
      const locale = parseLocale(key);
      if (path !== '' && !/^[\p{L}\p{N}-]+(?:\/[\p{L}\p{N}-]+)*$/u.test(path))
        throw new Error(`Invalid route path: ${record.id}/${locale}`);
      const identity = `${locale}/${path}`;
      if (paths.has(identity))
        throw new Error(`Duplicate route path: ${identity}`);
      paths.add(identity);
    }
    if (record.missing === 'redirect-ru' && record.paths.ru === undefined)
      throw new Error(`Missing Russian redirect target: ${record.id}`);
  }
}

export function resolveRoute(
  id: string,
  requested: Locale,
  records: readonly RouteDefinition[] = routes,
) {
  const locale = parseLocale(requested);
  const record = records.find((route) => route.id === id);
  if (!record) throw new Error(`Unknown route: ${id}`);
  if (record.paths[locale] !== undefined)
    return { locale, path: record.paths[locale], redirect: false };
  if (record.missing === 'redirect-ru' && record.paths.ru !== undefined)
    return { locale: 'ru' as const, path: record.paths.ru, redirect: true };
  return undefined;
}

export function localizedPath(
  id: string,
  locale: Locale,
  records: readonly RouteDefinition[] = routes,
): string | undefined {
  const target = resolveRoute(id, locale, records);
  return target && getRelativeLocaleUrl(target.locale, target.path);
}
export function availableTranslations(
  id: string,
  records: readonly RouteDefinition[] = routes,
) {
  return locales.flatMap((locale) => {
    const target = resolveRoute(id, locale, records);
    return target && !target.redirect
      ? [{ locale, href: getRelativeLocaleUrl(locale, target.path) }]
      : [];
  });
}
validateRoutes(routes);
