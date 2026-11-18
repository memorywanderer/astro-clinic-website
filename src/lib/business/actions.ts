import type { ContactInfo } from '@/content/contact';
import type {
  BusinessAction,
  ResolvedBusinessAction,
} from '@/content/business';
import { emailHref, httpHref, phoneHref } from '@/lib/contact';

export function internalHref(value: string): string | undefined {
  // Reject protocol-relative URLs, backslashes and URL-parser whitespace tricks.
  if (
    !value ||
    /[\s\\]/.test(value) ||
    [...value].some(
      (character) =>
        character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    )
  )
    return undefined;
  if (value.startsWith('#') && value.length > 1) return value;
  if (!value.startsWith('/') || value.startsWith('//')) return undefined;
  try {
    return new URL(value, 'https://internal.invalid').origin ===
      'https://internal.invalid'
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}
export function whatsappHref(
  number: string | undefined,
  message?: string,
): string | undefined {
  const tel = phoneHref(number)?.slice(4);
  // WhatsApp needs an explicit international number, not a national/local guess.
  if (!tel || !/^\+[1-9]\d{6,14}$/.test(tel)) return undefined;
  const url = new URL(`https://wa.me/${tel.slice(1)}`);
  if (message?.trim()) url.searchParams.set('text', message);
  return url.href;
}
export function telegramHref(account: string | undefined): string | undefined {
  const username = account?.trim().replace(/^@/, '');
  return username && /^[a-z][a-z\d_]{4,31}$/i.test(username)
    ? `https://t.me/${username}`
    : undefined;
}
export function actionHref(value: string): string | undefined {
  if (/^(?:tel:)/.test(value)) return phoneHref(value.slice(4));
  if (/^mailto:/.test(value)) {
    try {
      return emailHref(decodeURIComponent(value.slice(7)));
    } catch {
      return undefined;
    }
  }
  return internalHref(value) ?? httpHref(value);
}
export function resolveBusinessAction(
  source: BusinessAction,
  contacts: ContactInfo = {},
): ResolvedBusinessAction | undefined {
  if (!source.label.trim()) return undefined;
  let href: string | undefined;
  switch (source.kind) {
    case 'phone':
      href = phoneHref(contacts.phone?.number);
      break;
    case 'email':
      href = emailHref(contacts.email);
      break;
    case 'booking':
      href = httpHref(contacts.bookingUrl);
      break;
    case 'whatsapp':
      href = whatsappHref(contacts.messengers?.whatsapp, source.message);
      break;
    case 'telegram':
      href = telegramHref(contacts.messengers?.telegram);
      break;
    case 'internal':
      href = internalHref(source.href);
      break;
    case 'external':
      href = httpHref(source.href);
      break;
  }
  return href
    ? {
        label: source.label.trim(),
        href,
        external: /^https?:/.test(href),
        ...(source.emphasis ? { emphasis: source.emphasis } : {}),
      }
    : undefined;
}
export function usableAction(
  action: ResolvedBusinessAction | undefined,
): action is ResolvedBusinessAction {
  return !!action?.label.trim() && !!actionHref(action.href);
}
export function resolveBusinessActions(
  actions: readonly BusinessAction[],
  contacts: ContactInfo = {},
) {
  let primaryUsed = false;
  return actions.flatMap((source) => {
    const action = resolveBusinessAction(source, contacts);
    if (!action) return [];
    if (action.emphasis === 'primary') {
      if (primaryUsed) action.emphasis = 'secondary';
      primaryUsed = true;
    }
    return [action];
  });
}
