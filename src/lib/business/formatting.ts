import type {
  BusinessSchedule,
  FormattedPrice,
  Price,
  Validity,
} from '@/content/business';

export interface PriceLabels {
  from: string;
  request: string;
  free: string;
  range: string;
}
export function formatPrice(
  value: Price | undefined,
  locale: string,
  labels: PriceLabels,
  options: Pick<
    Intl.NumberFormatOptions,
    'currencyDisplay' | 'maximumFractionDigits'
  > = {},
): FormattedPrice | undefined {
  if (!value) return undefined;
  if (value.kind === 'request' || value.kind === 'free')
    return { value, text: labels[value.kind] };
  if (!/^[A-Z]{3}$/.test(value.currency))
    throw new Error('Invalid ISO currency');
  const amounts =
    value.kind === 'range' ? [value.min, value.max] : [value.amount];
  if (
    amounts.some((amount) => !Number.isFinite(amount) || amount < 0) ||
    (value.kind === 'range' && value.min > value.max)
  )
    throw new Error('Invalid price');
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currency,
    ...options,
  });
  const formattedAmount =
    value.kind === 'range' ? '' : formatter.format(value.amount);
  const text =
    value.kind === 'range'
      ? `${formatter.format(value.min)} ${labels.range} ${formatter.format(value.max)}`
      : value.kind === 'from'
        ? labels.from.includes('{price}')
          ? labels.from.replace('{price}', formattedAmount)
          : `${labels.from} ${formattedAmount}`
        : formattedAmount;
  return { value: { ...value }, text };
}
export function instant(value: string): number {
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      value,
    ) ||
    !Number.isFinite(Date.parse(value))
  )
    throw new Error('Expected an ISO instant with timezone');
  // Date.parse otherwise silently accepts dates such as February 30.
  const calendar = value.slice(0, 10);
  if (new Date(`${calendar}T00:00:00Z`).toISOString().slice(0, 10) !== calendar)
    throw new Error('Invalid calendar date');
  return Date.parse(value);
}
export function isCurrent(period: Validity, now: Date = new Date()): boolean {
  const start = period.startsAt ? instant(period.startsAt) : -Infinity;
  const end = period.endsAt ? instant(period.endsAt) : Infinity;
  if (start >= end || !Number.isFinite(now.getTime()))
    throw new Error('Invalid validity period');
  return start <= now.getTime() && now.getTime() < end;
}
export function formatBusinessDate(
  value: string,
  locale: string,
  timezone: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    dateStyle: 'long',
  }).format(instant(value));
}
export function formatBusinessTime(value: string, locale: string): string {
  if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value))
    throw new Error('Invalid schedule time');
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(`2000-01-01T${value}:00Z`));
}
export function formatWeekday(day: number, locale: string): string {
  if (!Number.isInteger(day) || day < 1 || day > 7)
    throw new Error('Invalid ISO weekday');
  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    weekday: 'long',
  }).format(new Date(Date.UTC(2024, 0, day))); // 2024-01-01 was Monday.
}
export function validateSchedule(schedule: BusinessSchedule): BusinessSchedule {
  new Intl.DateTimeFormat('en', { timeZone: schedule.timezone });
  if (!schedule.closedLabel.trim() || !schedule.timezoneLabel.trim())
    throw new Error('Missing schedule labels');
  if (schedule.exceptions?.length && !schedule.exceptionsLabel?.trim())
    throw new Error('Missing exceptions label');
  for (const row of [...schedule.rows, ...(schedule.exceptions ?? [])]) {
    if (!row.label.trim()) throw new Error('Missing day label');
    let previousEnd = '';
    for (const interval of row.intervals) {
      formatBusinessTime(interval.start, 'en');
      formatBusinessTime(interval.end, 'en');
      if (interval.start >= interval.end || interval.start < previousEnd)
        throw new Error(
          'Invalid or overlapping hours; split overnight intervals by day',
        );
      previousEnd = interval.end;
    }
  }
  return schedule;
}
