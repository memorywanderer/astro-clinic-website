import type { MediaSource } from '@/components/ui/Media.astro';
import type { ContactInfo } from './contact';

/** Contact actions reference the shared ContactInfo, never copy its destinations. */
export type BusinessAction = {
  label: string;
  emphasis?: 'primary' | 'secondary';
} & (
  | { kind: 'phone' | 'email' | 'booking' }
  | { kind: 'whatsapp'; message?: string }
  | { kind: 'telegram' }
  | { kind: 'internal' | 'external'; href: string }
);
export interface ResolvedBusinessAction {
  label: string;
  href: string;
  emphasis?: 'primary' | 'secondary';
  external: boolean;
}
export type Price =
  | { kind: 'exact' | 'from'; amount: number; currency: string }
  | { kind: 'range'; min: number; max: number; currency: string }
  | { kind: 'request' }
  | { kind: 'free' };
export interface FormattedPrice {
  value: Price;
  text: string;
}
export interface PriceItem {
  id: string;
  name: string;
  description?: string;
  price?: FormattedPrice;
  action?: ResolvedBusinessAction;
}
export interface PriceGroup {
  title?: string;
  items: readonly PriceItem[];
}
/** Absolute ISO instants with an offset. End is exclusive. */
export interface Validity {
  startsAt?: string;
  endsAt?: string;
}
export interface Announcement extends Validity {
  message: string;
  badge?: string;
  action?: ResolvedBusinessAction;
  validityLabel?: string;
}
export interface PromotionInfo extends Validity {
  title: string;
  description?: string;
  terms?: string;
  discount?: string;
  price?: FormattedPrice;
  media?: MediaSource;
  action?: ResolvedBusinessAction;
  validityLabel?: string;
}
export interface PaymentOption {
  name: string;
  kind: 'payment' | 'installment';
  description?: string;
  terms?: string;
  link?: ResolvedBusinessAction;
  /** A business fact checked by the author, not inferred from its region. */
  verified: boolean;
  media?: MediaSource;
}
export interface ReviewSource {
  link: ResolvedBusinessAction;
  snapshot?: {
    value: number;
    max: number;
    count?: number;
    countLabel?: string;
    checkedAt: string;
    label: string;
    checkedLabel: string;
    verified: boolean;
  };
}
export interface Credential extends Validity {
  name: string;
  issuer: string;
  reference?: string;
  dateLabel?: string;
  expiryLabel?: string;
  link?: ResolvedBusinessAction;
  media?: MediaSource;
  verified: boolean;
}
export interface HoursRow {
  label: string;
  /** Multiple intervals or an empty collection for a closed day. */
  intervals: readonly { start: string; end: string }[];
}
export interface BusinessSchedule {
  timezone: string;
  timezoneLabel: string;
  closedLabel: string;
  rows: readonly HoursRow[];
  exceptions?: readonly HoursRow[];
  exceptionsLabel?: string;
}
export interface BusinessLocation {
  address: NonNullable<ContactInfo['address']>;
  name?: string;
  coordinates?: { latitude: number; longitude: number };
  phone?: ResolvedBusinessAction;
  maps?: readonly ResolvedBusinessAction[];
  directions?: ResolvedBusinessAction;
  hours?: BusinessSchedule;
  media?: MediaSource;
}
