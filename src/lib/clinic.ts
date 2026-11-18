import { clinic, DEMO_MODE } from '@/config/clinic';
import { clinicCopy } from '@/content/clinic-polish';
import type { Locale } from '@/config/site';
import { whatsappHref } from '@/lib/business/actions';

/** No vendor, patient data, storage, cookies or network. */
export function track(eventName: string, params: Record<string, string>) {
  if (DEMO_MODE) return;
  window.dispatchEvent(
    new CustomEvent('clinic:analytics', { detail: { eventName, params } }),
  );
}
export function contactDestination(kind: 'whatsapp' | 'call', message: string) {
  return kind === 'call'
    ? `tel:${clinic.number}`
    : whatsappHref(clinic.number, message)!;
}
export function formatKzPhone(value: string) {
  let digits = value.replace(/\D/g, '');
  if (value.startsWith('+7') || (digits.length === 11 && /^[78]/.test(digits)))
    digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return '+7';
  return `+7 (${digits.slice(0, 3)}${digits.length >= 3 ? ') ' : ''}${digits.slice(3, 6)}${digits.length > 6 ? '-' : ''}${digits.slice(6, 8)}${digits.length > 8 ? '-' : ''}${digits.slice(8)}`;
}
export function openingStatus(now: Date, locale: Locale) {
  const u = clinicCopy[locale];
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: clinic.timezone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)!.value;
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(
    get('weekday'),
  );
  const time = `${get('hour')}:${get('minute')}`;
  const today = clinic.hours[day];
  const suffix = ` · ${u.hoursExample}`;
  if (today && time >= today[0] && time < today[1])
    return `${u.open} ${today[1]}${locale === 'kk' ? ' дейін' : ''}${suffix}`;
  for (let offset = 0; offset <= 7; offset++) {
    const next = (day + offset) % 7;
    const hours = clinic.hours[next];
    if (hours && (offset > 0 || time < hours[0]))
      return `${u.closed} ${offset === 0 ? '' : offset === 1 ? u.tomorrow : u.days[next]} ${u.at} ${hours[0]}${suffix}`;
  }
  return u.statusPending;
}
