import { parseLocale, type Locale } from '@/config/site';
import { ru, type Dictionary, type TranslationKey } from './dictionaries/ru';
import { kk } from './dictionaries/kk';
const dictionaries: Record<Locale, Partial<Dictionary>> = { ru, kk };

export function translate(
  dictionary: Partial<Dictionary>,
  key: TranslationKey,
  locale: Locale,
): string {
  const text = dictionary[key];
  if (text?.trim()) return text;
  console.warn(`[i18n] Missing UI translation: ${locale}/${key}; using ru`);
  return ru[key];
}
export function t(locale: Locale, key: TranslationKey): string {
  return translate(dictionaries[parseLocale(locale)], key, locale);
}
