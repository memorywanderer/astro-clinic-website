import type { Locale } from '@/config/site';
import type { ServiceItem } from '@/components/blocks/Services.astro';
import type { MediaSource } from '@/components/ui/Media.astro';
import type { ContactInfo } from './contact';
import type { PageId } from '@/i18n/routes';

export type Localized<T> = Record<Locale, T>;
export interface BusinessSource {
  id: string;
  name: Localized<string>;
  description: Localized<string>;
  address?: Partial<Localized<string>>;
  hours?: Partial<Localized<string>>;
  /** Optional verified machine-readable hours, e.g. Mo-Fr 09:00-18:00. */
  openingHours?: readonly string[];
  email: string;
  phone?: ContactInfo['phone'];
  messengers?: ContactInfo['messengers'];
  bookingUrl?: string;
  social?: ContactInfo['social'];
}
export interface BusinessInfo {
  id: string;
  name: string;
  description: string;
  details: ContactInfo;
  openingHours?: readonly string[];
}
export interface ServiceEntry {
  id: string;
  locale: Locale;
  title: string;
  description: string;
  media?: MediaSource;
  destination?: PageId;
  metadata?: string;
}
// Only the source-specific fields differ; the target remains the existing block API.
export interface FieldServiceSource {
  id: string;
  title: Localized<string>;
  description: Localized<string>;
  media?: Localized<MediaSource>;
  destination?: PageId;
  metadata?: Partial<Localized<string>>;
}
export type ResolvedService = ServiceItem;
export interface PageEntry {
  id: PageId;
  locale: Locale;
  metadata: {
    title: string;
    description: string;
    indexable: boolean;
    socialImage?: MediaSource;
  };
  hero: { title: string; description: string; eyebrow?: string };
  servicesTitle: string;
  about: { title: string; description: string };
  cta: { title: string; description: string };
}
export type PageContent = Omit<PageEntry, 'locale'>;
