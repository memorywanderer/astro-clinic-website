import { describe, expect, test } from 'vitest';
import {
  actionHref,
  internalHref,
  resolveBusinessAction,
  resolveBusinessActions,
  telegramHref,
  whatsappHref,
} from '@/lib/business/actions';
import {
  formatBusinessDate,
  formatBusinessTime,
  formatPrice,
  formatWeekday,
  instant,
  isCurrent,
  validateSchedule,
} from '@/lib/business/formatting';
import { resolveBusiness } from '@/content/normalize';
import type { ContactInfo } from '@/content/contact';
import type { BusinessSource } from '@/content/models';

// Reserved example number: exercised only in memory, never emitted into demo HTML.
const contacts: ContactInfo = {
  phone: { text: 'Example', number: '+1 (202) 555-0123' },
  email: 'a+team@example.com',
  messengers: { whatsapp: '+12025550124', telegram: '@example_account' },
  bookingUrl: 'https://example.com/book',
};
const labels = {
  from: 'от',
  request: 'По запросу',
  free: 'Бесплатно',
  range: '—',
};

test('whole-tenge presentation retains the numeric price contract', () => {
  const price = { kind: 'exact', amount: 18000, currency: 'KZT' } as const;
  for (const locale of ['ru', 'kk']) {
    const formatted = formatPrice(price, locale, labels, {
      currencyDisplay: 'narrowSymbol',
      maximumFractionDigits: 0,
    })!;
    expect(formatted.value).toEqual(price);
    expect(formatted.text).toContain('₸');
    expect(formatted.text).not.toMatch(/[,.]00/);
  }
});

describe('shared business contact action resolution', () => {
  test('uses a single shared contact record and independent messenger destinations', () => {
    expect(
      resolveBusinessAction({ kind: 'phone', label: 'Call' }, contacts)?.href,
    ).toBe('tel:+12025550123');
    expect(
      resolveBusinessAction({ kind: 'email', label: 'Email' }, contacts)?.href,
    ).toBe('mailto:a%2Bteam@example.com');
    expect(
      resolveBusinessAction({ kind: 'booking', label: 'Book' }, contacts)?.href,
    ).toBe('https://example.com/book');
    expect(
      resolveBusinessAction({ kind: 'telegram', label: 'Telegram' }, contacts)
        ?.href,
    ).toBe('https://t.me/example_account');
    const message = 'Смета: ә ғ қ? & + # / 😀';
    const action = resolveBusinessAction(
      { kind: 'whatsapp', label: 'Ask', message },
      contacts,
    )!;
    const url = new URL(action.href);
    expect(url.pathname).toBe('/12025550124');
    expect(url.searchParams.get('text')).toBe(message);
    expect([...url.searchParams.keys()]).toEqual(['text']);
    expect(
      resolveBusinessAction(
        { kind: 'whatsapp', label: 'No inferred phone' },
        { phone: contacts.phone },
      ),
    ).toBeUndefined();
  });
  test('omits missing contacts and rejects unsafe destinations', () => {
    for (const kind of [
      'phone',
      'email',
      'booking',
      'telegram',
      'whatsapp',
    ] as const)
      expect(resolveBusinessAction({ kind, label: 'Missing' })).toBeUndefined();
    for (const href of [
      'javascript:alert(1)',
      'data:text/html,bad',
      '//evil.example',
      '/\\evil.example',
      '/a\n/b',
      '',
      'https://user:password@example.com',
    ]) {
      expect(internalHref(href)).toBeUndefined();
      expect(
        resolveBusinessAction({ kind: 'internal', label: 'Bad', href }),
      ).toBeUndefined();
    }
    expect(
      resolveBusinessAction({
        kind: 'external',
        label: 'Bad',
        href: 'javascript:alert(1)',
      }),
    ).toBeUndefined();
    expect(
      resolveBusinessAction({ kind: 'internal', label: ' ', href: '#x' }),
    ).toBeUndefined();
    expect(whatsappHref('87015550123')).toBeUndefined();
    expect(telegramHref('bad/name')).toBeUndefined();
    expect(telegramHref('https://t.me/name')).toBeUndefined();
    expect(actionHref('mailto:%ZZ')).toBeUndefined();
    expect(actionHref('tel:++123')).toBeUndefined();
    expect(actionHref('/kk/services/')).toBe('/kk/services/');
  });
  test('keeps only one primary action without mutating authorship', () => {
    const actions = [
      {
        kind: 'internal' as const,
        label: 'One',
        href: '#one',
        emphasis: 'primary' as const,
      },
      {
        kind: 'internal' as const,
        label: 'Two',
        href: '#two',
        emphasis: 'primary' as const,
      },
    ];
    expect(
      resolveBusinessActions(actions).map((action) => action.emphasis),
    ).toEqual(['primary', 'secondary']);
    expect(actions[1].emphasis).toBe('primary');
  });
});

describe('commercial and schedule normalization', () => {
  test('formats all five price modes without zero fallbacks', () => {
    expect(formatPrice(undefined, 'ru', labels)).toBeUndefined();
    expect(
      formatPrice({ kind: 'from', amount: 5000, currency: 'KZT' }, 'kk', {
        ...labels,
        from: '{price} бастап',
      })?.text,
    ).toMatch(/ бастап$/);
    expect(formatPrice({ kind: 'request' }, 'ru', labels)?.text).toBe(
      'По запросу',
    );
    expect(formatPrice({ kind: 'free' }, 'ru', labels)?.text).toBe('Бесплатно');
    for (const currency of ['KZT', 'RUB', 'USD', 'EUR']) {
      const price = { kind: 'exact' as const, amount: 1234.5, currency };
      expect(formatPrice(price, 'kk', labels)).toEqual({
        value: price,
        text: new Intl.NumberFormat('kk', {
          style: 'currency',
          currency,
        }).format(price.amount),
      });
    }
    expect(
      formatPrice({ kind: 'from', amount: 5000, currency: 'KZT' }, 'ru', labels)
        ?.text,
    ).toMatch(/^от /);
    expect(
      formatPrice(
        { kind: 'range', min: 0, max: 5, currency: 'KZT' },
        'ru',
        labels,
      )?.text,
    ).toContain('—');
    for (const amount of [-1, NaN, Infinity])
      expect(() =>
        formatPrice({ kind: 'exact', amount, currency: 'KZT' }, 'ru', labels),
      ).toThrow();
    expect(() =>
      formatPrice(
        { kind: 'exact', amount: 1, currency: 'tenge' },
        'ru',
        labels,
      ),
    ).toThrow();
    expect(() =>
      formatPrice(
        { kind: 'range', min: 5, max: 1, currency: 'KZT' },
        'ru',
        labels,
      ),
    ).toThrow();
  });
  test('promotion boundaries are deterministic offset-aware instants', () => {
    const period = {
      startsAt: '2026-11-11T09:00:00+05:00',
      endsAt: '2026-11-12T09:00:00+05:00',
    };
    expect(isCurrent(period, new Date('2026-11-11T03:59:59Z'))).toBe(false);
    expect(isCurrent(period, new Date('2026-11-11T04:00:00Z'))).toBe(true);
    expect(isCurrent(period, new Date('2026-11-12T04:00:00Z'))).toBe(false);
    expect(isCurrent({})).toBe(true);
    expect(() =>
      isCurrent({ startsAt: period.endsAt, endsAt: period.startsAt }),
    ).toThrow();
    for (const value of [
      '2026-02-30T00:00:00Z',
      '2026-11-11',
      '2026-11-11T00:00:00',
      'bad',
    ])
      expect(() => instant(value)).toThrow();
  });
  test('formats locales and explicitly configured timezone, including a date boundary', () => {
    expect(
      formatBusinessDate('2026-11-10T23:00:00Z', 'ru', 'Asia/Almaty'),
    ).toContain('11');
    expect(formatWeekday(1, 'ru')).toBe('понедельник');
    expect(formatWeekday(1, 'kk')).toBe('дүйсенбі');
    expect(formatBusinessTime('09:30', 'kk')).toBe('09:30');
    expect(() => formatBusinessTime('25:00', 'ru')).toThrow();
    expect(() => formatWeekday(8, 'ru')).toThrow();
    const schedule = {
      timezone: 'Asia/Almaty',
      timezoneLabel: 'Алматы',
      closedLabel: 'Закрыто',
      rows: [
        {
          label: 'Пн',
          intervals: [
            { start: '09:00', end: '12:00' },
            { start: '13:00', end: '18:00' },
          ],
        },
        { label: 'Вс', intervals: [] },
      ],
    };
    expect(validateSchedule(schedule)).toEqual(schedule);
    expect(() =>
      validateSchedule({ ...schedule, timezone: 'bad/zone' }),
    ).toThrow();
    expect(() =>
      validateSchedule({
        ...schedule,
        rows: [{ label: 'Пн', intervals: [{ start: '18:00', end: '09:00' }] }],
      }),
    ).toThrow();
    expect(() =>
      validateSchedule({
        ...schedule,
        rows: [
          {
            label: 'Пн',
            intervals: [
              { start: '09:00', end: '13:00' },
              { start: '12:00', end: '18:00' },
            ],
          },
        ],
      }),
    ).toThrow();
    expect(() =>
      validateSchedule({
        ...schedule,
        exceptions: [{ label: 'Holiday', intervals: [] }],
      }),
    ).toThrow();
  });
  test('extends existing normalization without copying contacts into components', () => {
    const source: BusinessSource = {
      id: 'sample',
      name: { ru: 'Пример', kk: 'Үлгі' },
      description: { ru: 'Описание', kk: 'Сипаттама' },
      email: contacts.email!,
      phone: contacts.phone,
      messengers: contacts.messengers,
      bookingUrl: contacts.bookingUrl,
      social: [{ label: 'Site', href: 'https://example.com' }],
    };
    const resolved = resolveBusiness(source, 'kk');
    expect(resolved.details.messengers).toEqual(contacts.messengers);
    expect(resolved.details.phone).toEqual(contacts.phone);
    expect(resolved.details.phone).not.toBe(source.phone);
    expect(() =>
      resolveBusiness({ ...source, bookingUrl: 'javascript:alert(1)' }, 'ru'),
    ).toThrow();
    expect(() =>
      resolveBusiness(
        { ...source, messengers: { whatsapp: '87015550123' } },
        'ru',
      ),
    ).toThrow();
    expect(() =>
      resolveBusiness(
        { ...source, social: [{ label: 'bad', href: '//evil.example' }] },
        'ru',
      ),
    ).toThrow();
  });
});
