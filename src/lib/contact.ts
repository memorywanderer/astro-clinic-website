import type { ContactInfo } from '@/content/contact';

// Small URL boundary shared by Contact and Footer; blank or malformed values never become links.
export function phoneHref(value: string | undefined): string | undefined {
  const input = value?.trim();
  if (!input || !/^[+\d\s().-]+$/.test(input)) return undefined;
  const number = input.replace(/[\s().-]/g, '');
  return /^\+?\d{3,15}$/.test(number) ? `tel:${number}` : undefined;
}

export function emailHref(value: string | undefined): string | undefined {
  const input = value?.trim();
  if (!input || !/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(input))
    return undefined;
  return `mailto:${encodeURIComponent(input).replace('%40', '@')}`;
}

export function httpHref(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return ['https:', 'http:'].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}

export function hasContactInfo(details: ContactInfo | undefined): boolean {
  return (
    !!details &&
    !!(
      phoneHref(details.phone?.number) ||
      emailHref(details.email) ||
      details.address?.trim() ||
      details.hours?.trim() ||
      details.links?.some((link) => link.label.trim() && httpHref(link.href)) ||
      (details.map?.label.trim() && httpHref(details.map.href))
    )
  );
}
