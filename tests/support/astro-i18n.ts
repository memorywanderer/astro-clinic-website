// Unit-test double for Astro's build-configured virtual module.
// Production browser tests exercise the actual native helper and configured routing.
import { parseLocale } from '../../src/config/site';
export function getRelativeLocaleUrl(locale: string, path = '') {
  return `/${parseLocale(locale)}/${path ? `${path}/` : ''}`;
}
